import type { PgColumn } from 'drizzle-orm/pg-core'
import { getTableColumns, sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import * as schema from '~~/server/database/schema'
import { isValidTable } from '~~/server/utils/db'
import { filterSchema, processFilters, withFilters } from '~~/server/utils/query'

const pathSchema = z.object({
  tableName: z.string().min(1),
  columnName: z.string().min(1)
})

const querySchema = z.object({
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
    .optional()
})

export default eventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, pathSchema.parse)
  const query = await getValidatedQuery(event, querySchema.parse)

  const { tableName, columnName } = params
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

  if (!(columnName in columns)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: 'INVALID_COLUMN_NAME',
      message: 'Invalid Column Name'
    })
  }

  const db = await useDB(event)

  const columnKey = columnName as keyof typeof columns
  const column = table[columnKey] as PgColumn
  const countQuery = db.select({ column, count: sql<number>`cast(count(*) as int)` })
    .from(table)
    .groupBy(column)
    .$dynamic()

  if (query?.filter) {
    const filters = processFilters(query.filter, columns)
    if (filters.length) {
      withFilters(countQuery, filters)
    }
  }

  const result = await countQuery
  return result
})
