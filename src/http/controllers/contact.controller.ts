import { FastifyReply, FastifyRequest } from 'fastify'
import { ContactService } from '../../services/contact.service'
import { MESSAGES } from '../../utils/messages'
import { Contact } from '@prisma/client'
import { ContactInput, ContactQuery } from '../../dtos/contact.dto'

export class ContactController {
  constructor (private readonly _contactService = new ContactService()) {}

  async list (req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { term, page = 1, limit = 10 } = req.query as ContactQuery
    const pageNumber = Number(page) > 0 ? Number(page) : 1
    const pageSize = Number(limit) > 0 ? Number(limit) : 10

    try {
      const { contacts, total } = await this._contactService.index({
        term,
        page: pageNumber,
        limit: pageSize
      })

      const response: Api.Paginated<Contact> = {
        meta: {
          total,
          page: pageNumber,
          limit: pageSize,
          pages: Math.ceil(total / pageSize)
        },
        data: contacts,
        message: contacts.length === 0 ? MESSAGES.CONTACT_NOT_FOUND : undefined
      }

      return reply.code(200).send(response)
    } catch {
      return reply.code(500).send({
        message: MESSAGES.CONTACT_FETCH_ERROR,
        statusCode: 500
      } satisfies Api.Error)
    }
  }

  async create (req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const data = req.body as ContactInput

    try {
      const contact = await this._contactService.create(data)

      const response: Api.Response<Contact> = {
        data: contact,
        message: MESSAGES.CONTACT_CREATED
      }

      return reply.code(201).send(response)
    } catch (err: any) {
      if (err.code === 'P2002') {
        return reply.code(409).send({
          message: MESSAGES.CONTACT_EXISTS,
          statusCode: 409
        } satisfies Api.Error)
      }

      return reply.code(500).send({
        message: MESSAGES.CONTACT_CREATE_ERROR,
        statusCode: 500
      } satisfies Api.Error)
    }
  }

  async getPhoto (req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { guid } = req.params as { guid: string }

    try {
      const photoBase64 = await this._contactService.getPhotoById(guid)

      if (!photoBase64) {
        return reply.code(404).send({ message: MESSAGES.CONTACT_PHOTO_NOT_FOUND })
      }

      return reply.code(200).send(photoBase64)
    } catch {
      return reply.code(500).send({
        message: MESSAGES.INTERNAL_ERROR,
        statusCode: 500
      } satisfies Api.Error)
    }
  }
}
