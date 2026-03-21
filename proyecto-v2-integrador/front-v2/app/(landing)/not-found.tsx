import { ArrowLeftIcon, GameControllerIcon } from '@phosphor-icons/react/dist/ssr'

import { Button } from '@/ui'

export default function NotFound() {
  return (
    <>
      <div className="mx-auto max-w-md text-center">
        {/* Icono principal */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Glow effect */}
            <div className="from-primary-400 to-secondary-400 absolute inset-0 rounded-full bg-linear-to-r opacity-20 blur-2xl" />

            {/* Icono principal */}
            <div className="from-primary-400 to-secondary-400 relative rounded-2xl bg-linear-to-r p-6">
              <GameControllerIcon className="text-white" size={64} weight="fill" />
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <h1 className="font-display from-primary-400 to-secondary-400 bg-linear-to-r bg-clip-text text-6xl font-bold text-transparent sm:text-8xl">
            404
          </h1>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="font-display text-foreground mb-4 text-2xl font-bold sm:text-3xl">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg leading-relaxed text-neutral-400">
            Parece que esta página se fue a jugar a otro servidor. No te preocupes, te ayudamos a
            volver al gaming.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/" iconLeft={<ArrowLeftIcon size={20} />} variant="filled">
            Volver al Inicio
          </Button>

          <Button href="/games" iconLeft={<GameControllerIcon size={20} />} variant="outlined">
            Ver Juegos
          </Button>
        </div>

        {/* Fun gaming message */}
        <div className="bg-glass-bg border-glass-border mt-12 rounded-xl border p-4 backdrop-blur-lg">
          <p className="text-sm text-neutral-400">
            <span className="text-secondary-400 font-semibold">Pro tip:</span> Revisa la URL o usa
            la navegación para encontrar lo que buscas. ¡El gaming nunca para! 🎮
          </p>
        </div>
      </div>
    </>
  )
}
