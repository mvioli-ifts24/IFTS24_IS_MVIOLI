import { z } from 'zod'

export const preferencesSchema = z.object({
  accept_newsletter: z.boolean()
})

export type PreferencesFormData = z.output<typeof preferencesSchema>
export type PreferencesFormInput = z.input<typeof preferencesSchema>
