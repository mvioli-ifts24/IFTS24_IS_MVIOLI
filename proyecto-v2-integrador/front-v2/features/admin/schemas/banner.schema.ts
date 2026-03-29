import { z } from 'zod'

const isFile = (val: unknown): val is File => typeof File !== 'undefined' && val instanceof File

export const bannerSchema = z.object({
  contact: z.string().max(255, 'Máximo 255 caracteres').optional(),
  link: z.string().max(500, 'Máximo 500 caracteres').optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(255, 'Máximo 255 caracteres'),
  image_horizontal: z.custom<File>(isFile).optional(),
  image_vertical: z.custom<File>(isFile).optional()
})

export type BannerFormData = z.output<typeof bannerSchema>
