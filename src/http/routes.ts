import { FastifyInstance } from 'fastify'
import { ContactController } from './controllers/contact.controller'
import { authMiddleware } from './middlewares/auth.middleware'

const contactController = new ContactController()

export async function appRoutes (app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', authMiddleware)

  app.get('/hello', async () => { return { hello: 'world' } })
  app.get('/contact/search', contactController.list.bind(contactController))
  app.get('/contact/:guid/photo', contactController.getPhoto.bind(contactController))
  app.post('/contact', contactController.create.bind(contactController))
}
