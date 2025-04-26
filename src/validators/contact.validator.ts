import Joi from 'joi'
import { joiFieldMessages } from '../utils/joi-field-messages'
import { REGEX } from '../utils/regex'

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages(joiFieldMessages('nome', { min: 3, max: 100 })),
  cpf: Joi.string().length(11).pattern(REGEX.ONLY_NUMBERS).required().messages({ ...joiFieldMessages('CPF', { length: 11 }), 'string.pattern.base': 'O CPF deve conter apenas números.' }),
  email: Joi.string().email().required().messages({ ...joiFieldMessages('e-mail'), 'string.email': 'O e-mail deve ser válido.' }),
  phone: Joi.string().min(10).max(15).required().messages(joiFieldMessages('telefone', { min: 10, max: 15 }))
})

export const contactCreateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages(joiFieldMessages('nome', { min: 3, max: 100 })),
  cpf: Joi.string().length(11).pattern(REGEX.ONLY_NUMBERS).required().messages({
    ...joiFieldMessages('CPF', { length: 11 }),
    'string.pattern.base': 'O CPF deve conter apenas números.'
  }),
  email: Joi.string().email().required().messages({
    ...joiFieldMessages('e-mail'),
    'string.email': 'O e-mail deve ser válido.'
  }),
  phone: Joi.string().min(10).max(15).required().messages(joiFieldMessages('telefone', { min: 10, max: 15 })),
  photo: Joi.string().optional().messages({ 'string.base': 'A foto deve ser uma string base64 válida.' })
})
