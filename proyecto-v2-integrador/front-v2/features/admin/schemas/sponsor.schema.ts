import { z } from 'zod'

const isFile = (val: unknown): val is File => typeof File !== 'undefined' && val instanceof File

export const sponsorSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(255, 'Máximo 255 caracteres'),
  link: z.string().max(500, 'Máximo 500 caracteres').optional(),
  contact: z.string().max(255, 'Máximo 255 caracteres').optional(),
  image: z.custom<File>(isFile).optional()
})

export type SponsorFormData = z.output<typeof sponsorSchema>
