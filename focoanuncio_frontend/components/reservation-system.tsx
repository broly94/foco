"use client"

import Link from "next/link"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useReservations, useCreateReservation } from "@/hooks/use-reservations"
import { useCurrentUser } from "@/hooks/use-auth"
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react"
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns"
import { es } from "date-fns/locale"

// Esquema de validación para el formulario de reserva
const reservationSchema = z.object({
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora"),
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().min(6, "Ingresa un número de teléfono válido"),
  message: z.string().optional(),
})

type ReservationFormValues = z.infer<typeof reservationSchema>

export default function ReservationSystem({ strategyId }: { strategyId: string }) {
  const { toast } = useToast()
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Consulta para obtener las reservas existentes
  const { data: reservations, isLoading: isLoadingReservations } = useReservations(strategyId, {
    startDate: format(currentWeek, "yyyy-MM-dd"),
    endDate: format(addDays(currentWeek, 6), "yyyy-MM-dd"),
  })

  // Mutación para crear una nueva reserva
  const createReservation = useCreateReservation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: "",
      time: "",
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: "",
      message: "",
    },
  })

  // Actualizar los valores del formulario cuando el usuario está autenticado
  useState(() => {
    if (currentUser) {
      setValue("name", currentUser.name)
      setValue("email", currentUser.email)
    }
  })

  // Generar los días de la semana actual
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(currentWeek, index)
    return {
      date,
      formattedDate: format(date, "yyyy-MM-dd"),
      dayName: format(date, "EEE", { locale: es }),
      dayNumber: format(date, "d"),
    }
  })

  // Horarios disponibles (ejemplo)
  const availableTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00"]

  // Verificar si un horario está disponible
  const isTimeAvailable = (date: string, time: string) => {
    if (!reservations) return true
    return !reservations.some((reservation) => reservation.date === date && reservation.time === time)
  }

  // Manejar la selección de fecha
  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setValue("date", date)
    setSelectedTime(null)
    setValue("time", "")
  }

  // Manejar la selección de hora
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setValue("time", time)
  }

  // Manejar el envío del formulario
  const onSubmit = async (data: ReservationFormValues) => {
    if (!currentUser) {
      toast({
        title: "Inicia sesión para reservar",
        description: "Debes iniciar sesión para poder realizar una reserva",
        variant: "destructive",
      })
      return
    }

    try {
      await createReservation.mutateAsync({
        strategyId,
        ...data,
      })

      toast({
        title: "Reserva confirmada",
        description: `Tu reserva para el ${format(new Date(data.date), "PPP", { locale: es })} a las ${data.time} ha sido confirmada.`,
      })

      // Resetear el formulario
      reset()
      setSelectedDate(null)
      setSelectedTime(null)
    } catch (error) {
      toast({
        title: "Error al crear la reserva",
        description: "Ha ocurrido un error al procesar tu reserva. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Navegar a la semana anterior
  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  // Navegar a la semana siguiente
  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  if (isLoadingUser) {
    return <div className="text-center py-8">Cargando información de usuario...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sistema de reservas</h3>
        {!currentUser && (
          <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Inicia sesión para realizar una reserva
          </div>
        )}
      </div>

      {/* Calendario semanal */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-50 p-3 border-b">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="font-medium">
            {format(currentWeek, "d", { locale: es })} -{" "}
            {format(addDays(currentWeek, 6), "d 'de' MMMM, yyyy", { locale: es })}
          </h4>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((day) => (
            <button
              key={day.formattedDate}
              className={`p-3 text-center ${
                selectedDate === day.formattedDate ? "bg-emerald-100 hover:bg-emerald-200" : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleDateSelect(day.formattedDate)}
            >
              <div className="text-xs text-gray-500 uppercase">{day.dayName}</div>
              <div className="text-lg font-semibold">{day.dayNumber}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Horarios disponibles */}
      {selectedDate && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Horarios disponibles para el {format(new Date(selectedDate), "PPP", { locale: es })}
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {availableTimes.map((time) => {
              const available = isTimeAvailable(selectedDate, time)
              return (
                <button
                  key={time}
                  className={`p-2 text-center rounded-md ${
                    selectedTime === time
                      ? "bg-emerald-600 text-white"
                      : available
                        ? "bg-white border hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => available && handleTimeSelect(time)}
                  disabled={!available}
                >
                  <div className="flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{time}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Formulario de reserva */}
      {selectedDate && selectedTime && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Completa tus datos para reservar</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("date")} />
            <input type="hidden" {...register("time")} />

            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" {...register("name")} aria-invalid={errors.name ? "true" : "false"} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} aria-invalid={errors.email ? "true" : "false"} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" {...register("phone")} aria-invalid={errors.phone ? "true" : "false"} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje (opcional)</Label>
              <Textarea id="message" {...register("message")} rows={3} />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !currentUser}>
              {isSubmitting ? "Procesando..." : "Confirmar reserva"}
            </Button>

            {!currentUser && (
              <p className="text-sm text-center text-amber-600">
                <Link href="/login" className="font-medium underline">
                  Inicia sesión
                </Link>{" "}
                para poder realizar una reserva
              </p>
            )}
          </form>
        </div>
      )}

      {/* Lista de reservas existentes */}
      {isLoadingReservations ? (
        <div className="text-center py-4">Cargando reservas...</div>
      ) : reservations && reservations.length > 0 ? (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Próximas reservas</h4>
          <div className="space-y-2">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{format(new Date(reservation.date), "PPP", { locale: es })}</div>
                  <div className="text-sm text-gray-500">
                    {reservation.time} - {reservation.name}
                  </div>
                </div>
                <div className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded">Confirmada</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">No hay reservas para esta semana</div>
      )}
    </div>
  )
}
