export interface CreateRoomDTO {
  room_number: string
  capacity: number
  teacher_id: number
}

export interface UpdateRoomDTO {
  room_number?: string
  capacity?: number
  teacher_id?: number
}

export interface RoomResponseDTO {
  id: number
  room_number: string
  capacity: number
  is_available: boolean
  teacher_id: number
  created_at: string
  updated_at: string
  teacher?: {
    id: number
    name: string
    email: string
    registration: string
  }
  students?: Array<{
    id: number
    name: string
    email: string
    registration: string
  }>
}

export interface PaginatedRoomsDTO {
  data: RoomResponseDTO[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
  }
}