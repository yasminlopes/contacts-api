import fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './http/routes'
import dotenv from 'dotenv'

dotenv.config()

export const app = fastify()
void app.register(cors, { origin: true })
void app.register(appRoutes)
