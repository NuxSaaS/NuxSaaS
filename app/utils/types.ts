import type { CalendarDate } from '@internationalized/date'
import type { TableColumn } from '@nuxt/ui'
import type { CellContext, RowData } from '@tanstack/vue-table'

export type { FormSubmitEvent, NavigationMenuItem, TableData } from '@nuxt/ui'
export type { Row } from '@tanstack/vue-table'
export { z } from 'zod'
export type { output as zodOutput } from 'zod'
export { locales as zodLocales } from 'zod'

export type TranFunction = (name: string, options?: StringDict<any>) => string
export type ColumnCell<TData extends RowData, TValue = unknown> = CellContext<TData, TValue>
export type AdminTableColumn<T extends TableData, D = unknown> = TableColumn<T, D> & {
  accessorKey?: string
  header?: string
  id?: string
}

export interface StringDict<T> {
  [key: string]: T
}

export interface FilterItem {
  label: string
  id: string
  count?: number
}

export interface FilterInput {
  name: string
  field: string
  value: string | undefined
  type: 'input'
}

export interface FilterCheckbox {
  name: string
  field: string
  value: string[]
  type: 'checkbox'
  items: FilterItem[]
}

export interface FilterTabs {
  name: string
  field: string
  value: string
  type: 'tabs'
  items: FilterItem[]
}

export interface FilterDateRange {
  name: string
  field: string
  value: DateRange
  type: 'daterange'
}

export interface DateRange { start: CalendarDate | undefined, end: CalendarDate | undefined }

export type AdminTableFilter =
  | FilterInput
  | FilterCheckbox
  | FilterTabs
  | FilterDateRange

export interface SortOption {
  field: string
  order: 'asc' | 'desc'
}

export type FilterCondition = {
  col: string
  op: 'between'
  v: [string, string]
} | {
  col: string
  op: 'in'
  v: string[]
} | {
  col: string
  op: 'like'
  v: string
} | {
  col: string
  op: 'eq'
  v: string
}

export interface FetchDataParams {
  page: number
  limit: number
  sort: SortOption[]
  filter: FilterCondition[]
}

export interface PageData<T> {
  data: T[]
  total: number
}

export type FetchDataFn<T> = (params: FetchDataParams) => Promise<PageData<T>>

export interface ColumnCount {
  column: string
  count: number
}
