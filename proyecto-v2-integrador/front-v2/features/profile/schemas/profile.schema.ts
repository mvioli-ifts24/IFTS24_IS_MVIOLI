import { z } from 'zod'

const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024
const ACCEPTED_PROFILE_PICTURE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const profilePictureSchema = z
  .instanceof(File)
  .optional()
  .refine(file => !file || file.size <= MAX_PROFILE_PICTURE_SIZE, 'La imagen no puede superar 5MB')
  .refine(
    file => !file || ACCEPTED_PROFILE_PICTURE_TYPES.includes(file.type),
    'Solo se permiten imágenes JPG, PNG o WEBP'
  )

export const profileSchema = z.object({
  about: z.string().max(150, 'La descripción no puede superar 150 caracteres').optional(),
  favorite_game_id: z.number().nullable().optional(),
  profile_picture: profilePictureSchema,
  birth_date: z.string().optional().nullable(),
  gender_id: z.string().optional()
})

export type ProfileFormData = z.output<typeof profileSchema>
export type ProfileFormInput = z.input<typeof profileSchema>
