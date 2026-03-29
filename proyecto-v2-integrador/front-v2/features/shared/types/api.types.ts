export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type PaginatedApiResponse<T> = {
  data: T[] | null
  error: string | null
  total: number
  page: number
  pageSize: number
  prevUrl: string | null
  nextUrl: string | null
}
