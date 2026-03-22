import { z } from 'zod' // ← cambio clave

export const GENDERS = ['1', '2', '3'] as const
export type GenderId = (typeof GENDERS)[number]
export const GENDER_LABELS: Record<GenderId, string> = {
  '1': 'Masculino',
  '2': 'Femenino',
  '3': 'Otro'
}

const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024
const ACCEPTED_PROFILE_PICTURE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const genderSchema = z
  .union([z.enum(GENDERS), z.literal('')])
  .refine((value): value is GenderId => value !== '', {
    message: 'Debes seleccionar un género válido'
  })

const profilePictureSchema = z
  .instanceof(File, { message: 'Debes seleccionar una foto de perfil' })
  .refine(file => file.size <= MAX_PROFILE_PICTURE_SIZE, 'La imagen no puede superar 5MB')
  .refine(
    file => ACCEPTED_PROFILE_PICTURE_TYPES.includes(file.type),
    'Solo se permiten imágenes JPG, PNG o WEBP'
  )

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre es muy largo'),
    surname: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(100, 'El apellido es muy largo'),
    email: z.string().email('Email inválido'),
    birthDate: z.coerce
      .date({ error: 'Fecha de nacimiento inválida' })
      .refine(date => date < new Date(), 'La fecha no puede ser en el futuro')
      .refine(date => {
        const today = new Date()
        let age = today.getFullYear() - date.getFullYear()
        const monthDiff = today.getMonth() - date.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
          age -= 1
        }

        return age >= 13
      }, 'Debes tener al menos 13 años'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(100, 'La contraseña es muy larga'),
    confirmPassword: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
    gender_id: genderSchema,
    accept_newsletter: z
      .boolean()
      .refine(value => value === true, 'Debes aceptar la suscripción al newsletter'),
    profile_picture: profilePictureSchema
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

export type RegisterFormData = z.output<typeof registerSchema>
export type RegisterFormInput = z.input<typeof registerSchema>
