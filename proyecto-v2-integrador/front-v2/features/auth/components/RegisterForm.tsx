'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AvatarUpload, Button, Checkbox, DatePicker, Input, Select } from '@/ui'

import {
  GENDERS,
  GENDER_LABELS,
  registerSchema,
  type RegisterFormData,
  type RegisterFormInput
} from '../schemas/register'
import { AuthService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

export function RegisterForm() {
  const form = useForm<RegisterFormInput, unknown, RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      gender_id: '',
      accept_newsletter: false,
      profile_picture: undefined
    }
  })

  const errors = form.formState.errors
  const isLoading = form.formState.isSubmitting

  const setAuth = useAuthStore(state => state.setAuth)
  const router = useRouter()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await AuthService.register(data)

      if (result.error) {
        toast.error(result.error)

        return
      }

      const { token, user } = result.data!

      setAuth(token, user)

      toast.success('Cuenta creada exitosamente')

      // Redirigir según rol

      router.push('/dashboard')
    } catch {
      toast.error('Error de conexión, intentá de nuevo')
    }
  }

  const handleFileChange = (file: File | null) => {
    form.setValue('profile_picture', file ?? undefined, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <AvatarUpload
        avatarSize="xl"
        errorMessage={
          errors.profile_picture?.message ? String(errors.profile_picture.message) : undefined
        }
        fallback="icon"
        id="profile_picture"
        label="Foto de perfil"
        onFileChange={handleFileChange}
        state={errors.profile_picture ? 'error' : 'default'}
      />
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Input
          errorMessage={errors.name?.message}
          id="name"
          label="Nombre"
          state={errors.name ? 'error' : 'default'}
          type="text"
          {...form.register('name')}
        />
        <Input
          errorMessage={errors.surname?.message}
          id="surname"
          label="Apellido"
          state={errors.surname ? 'error' : 'default'}
          type="text"
          {...form.register('surname')}
        />
      </div>
      <Input
        errorMessage={errors.email?.message}
        id="email"
        label="Email"
        state={errors.email ? 'error' : 'default'}
        type="email"
        {...form.register('email')}
      />
      <DatePicker
        errorMessage={errors.birthDate?.message}
        id="birthDate"
        label="Fecha de nacimiento"
        state={errors.birthDate ? 'error' : 'default'}
        {...form.register('birthDate')}
      />
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Input
          errorMessage={errors.password?.message}
          id="password"
          label="Contraseña"
          state={errors.password ? 'error' : 'default'}
          type="password"
          {...form.register('password')}
        />

        <Input
          errorMessage={errors.confirmPassword?.message}
          id="confirmPassword"
          label="Confirmar Contraseña"
          state={errors.confirmPassword ? 'error' : 'default'}
          type="password"
          {...form.register('confirmPassword')}
        />
      </div>

      <Select
        errorMessage={errors.gender_id?.message}
        id="gender_id"
        label="Género"
        state={errors.gender_id ? 'error' : 'default'}
        {...form.register('gender_id')}
      >
        <option value="">Seleccionar género</option>
        {GENDERS.map(genderId => (
          <option key={genderId} value={genderId}>
            {GENDER_LABELS[genderId]}
          </option>
        ))}
      </Select>

      <Checkbox
        errorMessage={errors.accept_newsletter?.message}
        id="accept_newsletter"
        label="Acepto recibir newsletter"
        state={errors.accept_newsletter ? 'error' : 'default'}
        {...form.register('accept_newsletter')}
      />

      <Button fullWidth loading={isLoading} type="submit">
        Registrarse
      </Button>
    </form>
  )
}
