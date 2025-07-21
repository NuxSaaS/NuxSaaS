import type { SQL } from 'drizzle-orm'
import type { PgSelect } from 'drizzle-orm/pg-core'
import { asc, desc, getTableColumns, sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import * as schema from '~~/server/database/schema'
import { isValidTable } from '~~/server/utils/db'
import { filterSchema, processFilters, withFilters } from '~~/server/utils/query'

function withSorts<T extends PgSelect>(
  qb: T,
  sorts: SQL[]
) {
  return qb.orderBy(...sorts)
}

function withPagination<T extends PgSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize)
}

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

  const listQuery = db.select().from(table).$dynamic()
  const totalQuery = db.select({ count: sql<number>`cast(count(*) as int)` }).from(table).$dynamic()

  if (query) {
    // Handle filters
    if (query.filter) {
      const filters = processFilters(query.filter, columns)
      if (filters.length) {
        withFilters(listQuery, filters)
        withFilters(totalQuery, filters)
      }
    }
    // Handle sorting
    if (query.sort?.length) {
      const sorts: SQL[] = []
      for (const [field, direction] of query.sort) {
        if (field in columns) {
          const columnKey = field as keyof typeof columns
          const orderFunc = direction === 'desc' ? desc : asc
          sorts.push(orderFunc(columns[columnKey]))
        }
      }
      withSorts(listQuery, sorts)
    } else if ('id' in columns) {
      // Fallback sort to id desc
      const sorts: SQL[] = [desc(columns.id)]
      withSorts(listQuery, sorts)
    }
  }

  // Handle pagination
  const page = query?.page || 1
  const limit = query?.limit || 20
  withPagination(listQuery, page, limit)
  const count = await totalQuery
  const result = await listQuery

  return {
    data: result,
    total: count[0]?.count || 0,
    page,
    limit
  }
})
