import { z } from 'zod'

export const searchSchema = z.object({
  text: z
    .string()
    .min(3, 'El texto de busqueda debe tener al menos 3 caracteres')
})
