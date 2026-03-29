import { z } from 'zod'

export const editUserRoleSchema = z.object({
  role_id: z.number({ error: 'Seleccioná un rol válido' }).int().positive()
})

export type EditUserRoleFormData = z.output<typeof editUserRoleSchema>
