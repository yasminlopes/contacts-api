import { FastifyRequest, FastifyReply } from 'fastify'
import env from '../../config/env'
import { MESSAGES } from '../../utils/messages'

const ALLOWED_CPF = env.documentNumber

export async function authMiddleware (request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = request.headers.token

  if (!token || typeof token !== 'string') return reply.code(401).send({ message: MESSAGES.TOKEN_REQUIRED })

  let decoded: string

  try {
    decoded = Buffer.from(token, 'base64').toString('utf-8')
  } catch {
    return reply.code(403).send({ message: MESSAGES.INVALID_TOKEN })
  }

  if (decoded !== ALLOWED_CPF) {
    return reply.code(403).send({ message: MESSAGES.UNAUTHORIZED })
  }
}
