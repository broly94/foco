# Estructura de TanStack Query en la aplicación

Este documento explica cómo está estructurado TanStack Query en nuestra aplicación para manejar el estado del servidor y las peticiones a la API.

## Estructura general

La aplicación utiliza TanStack Query para manejar:
- Peticiones a la API
- Caché de datos
- Revalidación automática
- Mutaciones (creación, actualización, eliminación)

## Configuración global

La configuración global de TanStack Query se encuentra en `components/providers.tsx`. Aquí se configura:

- El tiempo de caducidad de la caché (staleTime)
- La política de revalidación
- ReactQueryDevtools para desarrollo

\`\`\`tsx
// components/providers.tsx
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minuto
          refetchOnWindowFocus: false,
        },
      },
    }),
)
\`\`\`

## Hooks por entidad

Los hooks de TanStack Query están organizados por entidad:

### Autenticación (`hooks/use-auth.ts`)
- `useCurrentUser()`: Obtiene el usuario actual
- `useLogin()`: Inicia sesión
- `useRegister()`: Registra un nuevo usuario
- `useLogout()`: Cierra sesión

### Estrategias de marketing (`hooks/use-strategies.ts`)
- `useStrategies()`: Obtiene todas las estrategias
- `useStrategy(id)`: Obtiene una estrategia específica
- `useCreateStrategy()`: Crea una nueva estrategia
- `useUpdateStrategy()`: Actualiza una estrategia existente
- `useDeleteStrategy()`: Elimina una estrategia

### Reservas (`hooks/use-reservations.ts`)
- `useReservations(strategyId)`: Obtiene las reservas de una estrategia
- `useReservation(id)`: Obtiene una reserva específica
- `useCreateReservation()`: Crea una nueva reserva
- `useCancelReservation()`: Cancela una reserva existente
- `useUserReservations()`: Obtiene las reservas del usuario actual

## Claves de consulta

Las claves de consulta están estructuradas para facilitar la invalidación selectiva:

\`\`\`tsx
// Ejemplos de claves de consulta
["currentUser"]
["strategies", { category: "marketing-digital" }]
["strategy", "123"]
["reservations", "123", { startDate: "2023-01-01" }]
\`\`\`

## Uso a nivel de página

Cada página utiliza los hooks específicos que necesita:

\`\`\`tsx
// Ejemplo: Página de estrategia
function StrategyPage({ params }) {
  const { data: strategy } = useStrategy(params.id)
  // ...
}

// Ejemplo: Página de búsqueda
function SearchPage({ searchParams }) {
  const { data: strategies } = useStrategies(searchParams)
  // ...
}
\`\`\`

## Manejo de mutaciones

Las mutaciones (crear, actualizar, eliminar) están configuradas para invalidar automáticamente las consultas relacionadas:

\`\`\`tsx
// Ejemplo: Crear una reserva
const createReservation = useCreateReservation()

// Al enviar el formulario
const onSubmit = async (data) => {
  await createReservation.mutateAsync({
    strategyId,
    ...data,
  })
  // La consulta de reservaciones se invalidará automáticamente
}
\`\`\`

## Optimizaciones

- **Prefetching**: En algunas páginas, precargamos datos que el usuario probablemente necesitará
- **Revalidación selectiva**: Solo invalidamos las consultas necesarias
- **Caché compartida**: Los datos se comparten entre componentes que usan la misma consulta

## Conclusión

Esta estructura permite:
1. Separación clara de responsabilidades
2. Reutilización de lógica
3. Manejo eficiente de la caché
4. Experiencia de usuario fluida con datos actualizados

Para añadir nuevas funcionalidades, sigue el patrón de crear hooks específicos por entidad y utilizar las claves de consulta adecuadas.
