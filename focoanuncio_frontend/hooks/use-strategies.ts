"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

// Claves de consulta para estrategias
export const STRATEGIES_QUERY_KEY = "strategies"
export const STRATEGY_QUERY_KEY = "strategy"

// Hook para obtener todas las estrategias
export function useStrategies(params?: Record<string, string>) {
  return useQuery({
    queryKey: [STRATEGIES_QUERY_KEY, params],
    queryFn: () => api.getStrategies(params),
  })
}

// Hook para obtener una estrategia específica
export function useStrategy(id: string) {
  return useQuery({
    queryKey: [STRATEGY_QUERY_KEY, id],
    queryFn: () => api.getStrategyById(id),
    enabled: !!id,
  })
}

// Hook para crear una estrategia
export function useCreateStrategy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => api.createStrategy(data),
    onSuccess: () => {
      // Invalidar la consulta de estrategias para actualizar la lista
      queryClient.invalidateQueries({ queryKey: [STRATEGIES_QUERY_KEY] })
    },
  })
}

// Hook para actualizar una estrategia
export function useUpdateStrategy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateStrategy(id, data),
    onSuccess: (data) => {
      // Invalidar la consulta de la estrategia específica
      queryClient.invalidateQueries({ queryKey: [STRATEGY_QUERY_KEY, data.id.toString()] })
      // Invalidar la consulta de estrategias para actualizar la lista
      queryClient.invalidateQueries({ queryKey: [STRATEGIES_QUERY_KEY] })
    },
  })
}

// Hook para eliminar una estrategia
export function useDeleteStrategy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteStrategy(id),
    onSuccess: (_, id) => {
      // Invalidar la consulta de la estrategia específica
      queryClient.invalidateQueries({ queryKey: [STRATEGY_QUERY_KEY, id.toString()] })
      // Invalidar la consulta de estrategias para actualizar la lista
      queryClient.invalidateQueries({ queryKey: [STRATEGIES_QUERY_KEY] })
    },
  })
}
