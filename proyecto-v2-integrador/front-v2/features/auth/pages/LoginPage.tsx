'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, CardBorderGlow, Heading, Input, Separator, Text } from '@/ui'

import { loginSchema, type LoginFormData } from '../schemas/login'
import { AuthService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

export function LoginPage() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const errors = form.formState.errors
  const isLoading = form.formState.isSubmitting

  const setAuth = useAuthStore(state => state.setAuth)
  const router = useRouter()

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await AuthService.login(data)

      if (result.error) {
        toast.error(result.error)

        return
      }

      const { token, user } = result.data!

      setAuth(token, user)

      toast.success('Sesión iniciada exitosamente')

      // Redirigir según rol

      router.push('/dashboard')
    } catch (error) {
      toast.error('Error de conexión, intentá de nuevo')
    }
  }

  return (
    <CardBorderGlow className="min-w-full p-6 md:min-w-2xl">
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex flex-col items-center gap-2">
          <Heading className="text-center" level="h2" size="xs" variant="default" weight="medium">
            ¡Hola de nuevo!
          </Heading>
          <Text className="text-center" size="sm" variant="muted" weight="light">
            Ingresa a tu cuenta para continuar
          </Text>
        </div>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            errorMessage={errors.email?.message}
            id="email"
            label="Email"
            state={errors.email ? 'error' : 'default'}
            type="email"
            {...form.register('email')}
          />
          <Input
            errorMessage={errors.password?.message}
            id="password"
            label="Contraseña"
            state={errors.password ? 'error' : 'default'}
            type="password"
            {...form.register('password')}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <Separator className="h-1 w-full" />
        <div className="flex flex-col items-center gap-2">
          <Text size="sm">¿No tienes una cuenta? </Text>
          <Button color="secondary" href="/register" size="sm" variant="text">
            Regístrate
          </Button>
        </div>
      </div>
    </CardBorderGlow>
  )
}
