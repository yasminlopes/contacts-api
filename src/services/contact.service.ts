import { prisma } from '../infra/db/prisma/client'
import { ContactInput, ContactQuery } from '../dtos/contact.dto'

export class ContactService {
  constructor (private readonly db = prisma) {}

  async index (params: ContactQuery): Promise<{ contacts: any[], total: number }> {
    const skip = (params.page - 1) * params.limit

    const [contacts, total] = await Promise.all([
      this.db.contact.findMany({
        where: params.term
          ? {
              name: { contains: params.term, mode: 'insensitive' }
            }
          : undefined,
        orderBy: { name: 'asc' },
        skip,
        take: params.limit
      }),
      this.db.contact.count({
        where: params.term
          ? {
              name: { contains: params.term, mode: 'insensitive' }
            }
          : undefined
      })
    ])

    return { contacts, total }
  }

  async create (data: ContactInput): Promise<ReturnType<typeof prisma.contact.create>> {
    return this.db.contact.create({
      data: {
        ...data,
        havephoto: !!data.photo
      }
    })
  }

  async getPhotoById (guid: string): Promise<string | null> {
    const contact = await this.db.contact.findUnique({
      where: { guid },
      select: { photo: true, havephoto: true }
    })

    if (!contact || !contact.havephoto || !contact.photo) return null

    return contact.photo
  }

  async updatePhoto (guid: string, photoBase64: string): Promise<boolean> {
    const existing = await this.db.contact.findUnique({ where: { guid } })
    if (!existing) return false

    await this.db.contact.update({
      where: { guid },
      data: {
        photo: photoBase64,
        havephoto: true
      }
    })

    return true
  }

  async update (guid: string, data: Partial<ContactInput>): Promise<boolean> {
    const existing = await this.db.contact.findUnique({ where: { guid } })
    if (!existing) return false

    await this.db.contact.update({
      where: { guid },
      data
    })

    return true
  }
}
