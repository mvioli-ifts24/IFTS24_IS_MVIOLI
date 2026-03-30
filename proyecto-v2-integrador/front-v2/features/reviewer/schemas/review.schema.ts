import { z } from 'zod'

export const reviewSchema = z.object({
  api_game_id: z.number().int().min(1, 'Seleccioná un juego'),
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string()
    .min(10, 'La reseña debe tener al menos 10 caracteres')
    .max(2000, 'La reseña no puede superar los 2000 caracteres'),
  rating_id: z.number().int().min(1, 'Elegí una valoración').max(5)
})

export type ReviewFormData = z.infer<typeof reviewSchema>
