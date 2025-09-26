import { IRoomRepository } from 'App/Repositories/RoomRepository'

export class GetRoomDetailsUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomId: number): Promise<{
    id: number
    roomNumber: string
    capacity: number
    isAvailable: boolean
    teacher: {
      id: number
      name: string
      email: string
      registration: string
    } | null
    students: Array<{
      id: number
      name: string
      email: string
      registration: string
    }>
    currentStudents: number
    availableSpots: number
    createdAt: string
    updatedAt: string
  }> {
    const room = await this.roomRepository.findByIdWithRelations(roomId)
    
    return {
      id: room.id,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      isAvailable: room.isAvailable,
      teacher: room.teacher ? {
        id: room.teacher.id,
        name: room.teacher.name,
        email: room.teacher.email,
        registration: room.teacher.registration
      } : null,
      students: room.students ? room.students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        registration: student.registration
      })) : [],
      currentStudents: room.students ? room.students.length : 0,
      availableSpots: room.capacity - (room.students ? room.students.length : 0),
      createdAt: room.createdAt.toString(),
      updatedAt: room.updatedAt.toString()
    }
  }
}