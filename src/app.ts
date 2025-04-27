import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './http/routes'

export async function appPlugin (app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: '*'
  })
  await app.register(appRoutes)
}
