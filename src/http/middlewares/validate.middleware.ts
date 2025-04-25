import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { ObjectSchema } from 'joi'

export function validateSchema (schema: ObjectSchema) {
  return function (req: FastifyRequest,reply: FastifyReply,done: HookHandlerDoneFunction) {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      void reply.code(400).send({
        message: 'Validation failed',
        details: error.details.map((err) => err.message),
        statusCode: 400
      })
      return
    }

    done()
  }
}
