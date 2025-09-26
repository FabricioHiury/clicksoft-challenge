import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { IRoomRepository } from 'App/Repositories/RoomRepository'

export interface GetRoomsResponseDTO {
  teacherName: string
  teacherRegistration: string
  rooms: Array<{
    id: number
    roomNumber: string
    capacity: number
    isAvailable: boolean
    currentStudents: number
    availableSpots: number
  }>
}

export class GetRoomsUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private roomRepository: IRoomRepository
  ) {}

  public async execute(teacherId: number): Promise<GetRoomsResponseDTO> {
    const teacher = await this.teacherRepository.findById(teacherId)
    
    const paginatedRooms = await this.roomRepository.findAll(1, 1000) 
    const rooms = paginatedRooms.all ? paginatedRooms.all() : paginatedRooms
    const teacherRooms = rooms.filter(room => room.teacherId === teacherId)
    
    const roomsWithCounts = await Promise.all(
      teacherRooms.map(async (room) => {
        const currentStudents = await this.roomRepository.getStudentCount(room.id)
        return {
          id: room.id,
          roomNumber: room.roomNumber,
          capacity: room.capacity,
          isAvailable: room.isAvailable,
          currentStudents,
          availableSpots: room.capacity - currentStudents
        }
      })
    )

    return {
      teacherName: teacher.name,
      teacherRegistration: teacher.registration,
      rooms: roomsWithCounts
    }
  }
}