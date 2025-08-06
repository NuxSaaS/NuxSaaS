import type { SQL } from 'drizzle-orm'
import { and, asc, count, desc, getTableColumns } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import * as schema from '~~/server/database/schema'
import { isValidTable } from '~~/server/utils/db'
import { filterSchema, processFilters } from '~~/server/utils/query'

const sortSchema = z.array(
  z.tuple([
    z.string(),
    z.enum(['asc', 'desc'])
  ])
)

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  filter: z.string()
    .transform((str) => {
      try {
        const parsed = JSON.parse(str)
        if (!Array.isArray(parsed))
          return []

        return parsed.reduce<z.infer<typeof filterSchema>>((validFilters, item) => {
          const result = filterSchema.element.safeParse(item)
          if (result.success) {
            validFilters.push(result.data)
          }
          return validFilters
        }, [])
      }
      catch {
        return []
      }
    })
    .optional(),
  sort: z.string()
    .transform((str) => {
      try {
        const parsed = JSON.parse(str)
        if (!Array.isArray(parsed))
          return []

        return parsed.reduce<z.infer<typeof sortSchema>>((validSorts, item) => {
          const result = sortSchema.element.safeParse(item)
          if (result.success) {
            validSorts.push(result.data)
          }
          return validSorts
        }, [])
      }
      catch {
        return []
      }
    })
    .optional(),
  with: z.string()
    .transform((str) => {
      try {
        const parsed = JSON.parse(str)
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))
          return undefined
        return parsed
      }
      catch {
        return undefined
      }
    })
    .optional()
})

export default eventHandler(async (event) => {
  const tableName = getRouterParam(event, 'tableName')
  if (!tableName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: 'EMPTY_TABLE_NAME',
      message: 'Empty Table Name'
    })
  }

  if (!isValidTable(tableName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: 'INVALID_TABLE_NAME',
      message: 'Invalid Table Name'
    })
  }

  const table = schema[tableName]
  if (!(table instanceof PgTable)) {
    throw createError(
      {
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: 'INVALID_TABLE_TYPE',
        message: 'Invalid Table Name'
      }
    )
  }
  const columns = getTableColumns(table)

  const query = await getValidatedQuery(event, querySchema.parse)
  const db = await useDB(event)

  // Build query options
  const queryOptions: {
    where?: SQL
    orderBy?: SQL[]
    limit?: number
    offset?: number
    with?: Record<string, any>
  } = {}

  // Handle filters
  if (query?.filter?.length) {
    const filters = processFilters(query.filter, columns)
    if (filters.length) {
      queryOptions.where = filters.length === 1 ? filters[0] : and(...filters)
    }
  }

  // Handle sorting
  if (query?.sort?.length) {
    const orderBy: SQL[] = []
    for (const [field, direction] of query.sort) {
      if (field in columns) {
        const columnKey = field as keyof typeof columns
        const orderFunc = direction === 'desc' ? desc : asc
        orderBy.push(orderFunc(columns[columnKey]))
      }
    }
    if (orderBy.length) {
      queryOptions.orderBy = orderBy
    }
  } else if ('id' in columns) {
    // Fallback sort to id desc
    queryOptions.orderBy = [desc(columns.id)]
  }

  // Handle with parameter for relational queries
  if (query?.with) {
    queryOptions.with = query.with
  }

  // Handle pagination
  const page = query?.page || 1
  const limit = query?.limit || 20
  queryOptions.limit = limit
  queryOptions.offset = (page - 1) * limit

  // Get total count
  const totalCountOptions = queryOptions.where ? { where: queryOptions.where } : {}
  const totalResult = await db.select({ count: count() }).from(table).where(totalCountOptions.where)
  const total = totalResult[0]?.count || 0

  const queryMethod = db.query[tableName as keyof typeof db.query] as any
  const result: Array<any> = await queryMethod.findMany(queryOptions)
  return {
    data: result,
    total,
    page,
    limit
  }
})
