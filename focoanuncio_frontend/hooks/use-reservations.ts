"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

// Tipos
interface Reservation {
  id: string
  strategyId: string
  userId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  message?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

interface ReservationFilters {
  startDate?: string
  endDate?: string
  status?: string
}

interface CreateReservationData {
  strategyId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  message?: string
}

// Hook para obtener las reservas de una estrategia
export function useReservations(strategyId: string, filters?: ReservationFilters) {
  return useQuery({
    queryKey: ["reservations", strategyId, filters],
    queryFn: () => api.getReservations(strategyId, filters),
    enabled: !!strategyId,
  })
}

// Hook para obtener una reserva específica
export function useReservation(reservationId: string) {
  return useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: () => api.getReservationById(reservationId),
    enabled: !!reservationId,
  })
}

// Hook para crear una nueva reserva
export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReservationData) => api.createReservation(data),
    onSuccess: (data, variables) => {
      // Invalidar la consulta de reservas para actualizar la lista
      queryClient.invalidateQueries({ queryKey: ["reservations", variables.strategyId] })
    },
  })
}

// Hook para cancelar una reserva
export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reservationId: string) => api.cancelReservation(reservationId),
    onSuccess: (data) => {
      // Invalidar la consulta de reservas para actualizar la lista
      queryClient.invalidateQueries({ queryKey: ["reservations", data.strategyId] })
      // Invalidar la consulta de la reserva específica
      queryClient.invalidateQueries({ queryKey: ["reservation", data.id] })
    },
  })
}

// Hook para obtener las reservas del usuario actual
export function useUserReservations() {
  return useQuery({
    queryKey: ["userReservations"],
    queryFn: () => api.getUserReservations(),
  })
}
