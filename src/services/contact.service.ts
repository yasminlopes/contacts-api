import { prisma } from '../infra/db/prisma/client'
import { ContactInput, ContactQuery } from '../dtos/contact.dto'
import { Contact } from '@prisma/client'

export class ContactService {
  constructor (private readonly db = prisma) {}

  async index (params: ContactQuery): Promise<{ contacts: Contact[], total: number }> {
    const skip = (params.page - 1) * params.limit

    if (params.guid) {
      const contact = await this.db.contact.findUnique({
        where: { guid: params.guid }
      })

      return {
        contacts: contact ? [contact] : [],
        total: contact ? 1 : 0
      }
    }

    const whereCondition = params.term
      ? { name: { contains: params.term, mode: 'insensitive' as const } }
      : undefined

    const [contacts, total] = await Promise.all([
      this.db.contact.findMany({
        where: whereCondition,
        orderBy: { name: 'asc' },
        skip,
        take: params.limit
      }),
      this.db.contact.count({
        where: whereCondition
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

  async delete (guid: string): Promise<Contact | null> {
    const existing = await this.db.contact.findUnique({ where: { guid } })
    if (!existing) return null

    await this.db.contact.delete({ where: { guid } })

    return existing
  }

  async deletePhoto (guid: string): Promise<Contact | null> {
    const existing = await this.db.contact.findUnique({ where: { guid } })
    if (!existing || !existing.havephoto) return null

    await this.db.contact.update({
      where: { guid },
      data: {
        photo: null,
        havephoto: false
      }
    })

    const updatedContact: Contact = {
      ...existing,
      photo: null,
      havephoto: false
    }
    return updatedContact
  }
}
