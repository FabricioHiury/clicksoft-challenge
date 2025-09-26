import { IRoomRepository } from 'App/Repositories/RoomRepository'
import { RoomResponseDTO } from 'App/DTOs/RoomDTO'

export class GetAvailableRoomsUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(page: number = 1, perPage: number = 10): Promise<{
    data: RoomResponseDTO[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
      nextPageUrl: string | null
      previousPageUrl: string | null
    }
  }> {
    const rooms = await this.roomRepository.findAvailable(page, perPage)
    
    const roomsData = rooms.all().map(room => ({
      id: room.id,
      room_number: room.roomNumber,
      capacity: room.capacity,
      is_available: room.isAvailable,
      teacher: room.teacher ? {
        id: room.teacher.id,
        name: room.teacher.name,
        email: room.teacher.email,
        registration: room.teacher.registration
      } : null,
      created_at: room.createdAt.toString(),
      updated_at: room.updatedAt.toString()
    }))

    return {
      data: roomsData,
      meta: {
        total: rooms.total,
        perPage: rooms.perPage,
        currentPage: rooms.currentPage,
        lastPage: rooms.lastPage,
        firstPage: 1,
        nextPageUrl: rooms.hasMorePages ? `?page=${rooms.currentPage + 1}` : null,
        previousPageUrl: rooms.currentPage > 1 ? `?page=${rooms.currentPage - 1}` : null
      }
    }
  }
}