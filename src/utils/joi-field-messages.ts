export function joiFieldMessages (fieldLabel: string, options?: {
  min?: number
  max?: number
  length?: number
}): Record<string, string> {
  const base = {
    'string.empty': `O ${fieldLabel} é obrigatório.`,
    'any.required': `O ${fieldLabel} é obrigatório.`
  }

  if (options?.min) {
    base['string.min'] = `O ${fieldLabel} deve ter no mínimo ${options.min} caracteres.`
  }

  if (options?.max) {
    base['string.max'] = `O ${fieldLabel} deve ter no máximo ${options.max} caracteres.`
  }

  if (options?.length) {
    base['string.length'] = `O ${fieldLabel} deve ter exatamente ${options.length} caracteres.`
  }

  return base
}
