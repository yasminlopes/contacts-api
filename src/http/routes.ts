import { FastifyInstance } from 'fastify'
import { ContactController } from './controllers/contact.controller'
import { authMiddleware } from './middlewares/auth.middleware'
import { validateSchema } from './middlewares/validate.middleware'
import { contactUpdateSchema } from '../validators/contact.validator'

const contactController = new ContactController()

export async function appRoutes (app: FastifyInstance): Promise<void> {
  app.get('/hello', async () => { return { hello: 'world' } })

  await app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authMiddleware)

    protectedRoutes.get('/contact/search', contactController.list.bind(contactController))
    protectedRoutes.get('/contact/:guid/photo', contactController.getPhoto.bind(contactController))
    protectedRoutes.patch('/contact/:guid/photo', contactController.updatePhoto.bind(contactController))
    protectedRoutes.post('/contact', contactController.create.bind(contactController))
    protectedRoutes.delete('/contact/:guid', contactController.delete.bind(contactController))
    protectedRoutes.delete('/contact/:guid/photo', contactController.deletePhoto.bind(contactController))
    protectedRoutes.patch('/contact/:guid',
      { preHandler: [authMiddleware, validateSchema(contactUpdateSchema)] },
      contactController.update.bind(contactController)
    )
  })
}
