export interface ContactInput {
  name: string
  cpf: string
  email: string
  phone: string
  photo?: string
}

export interface ContactQuery {
  term?: string
  page?: number
  limit?: number
}
