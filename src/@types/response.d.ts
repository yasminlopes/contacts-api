declare namespace Api {
  interface Response<T> {
    data: T
    message?: string
  }

  interface Error {
    message: string
    statusCode?: number
  }

  interface Paginated<T> {
    data: T[]
    meta: {
      total: number
      page: number
      limit: number
      pages: number
    }
    message?: string
  }
}
