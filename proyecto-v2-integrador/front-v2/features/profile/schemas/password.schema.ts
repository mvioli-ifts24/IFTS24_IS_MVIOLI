import { z } from 'zod'

export const passwordSchema = z
  .object({
    current_password: z.string().min(6, 'La contraseña actual debe tener al menos 6 caracteres'),
    new_password: z
      .string()
      .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
      .max(100, 'La contraseña es muy larga'),
    confirm_password: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres')
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password']
  })

export type PasswordFormData = z.output<typeof passwordSchema>
export type PasswordFormInput = z.input<typeof passwordSchema>
