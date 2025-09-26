import { IStudentRepository } from 'App/Repositories/StudentRepository'

export class GetStudentRoomsUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(studentId: number): Promise<{
    student: {
      id: number
      name: string
      email: string
      registration: string
    }
    rooms: Array<{
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
    }>
  }> {
    const student = await this.studentRepository.findByIdWithRooms(studentId)
    
    return {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        registration: student.registration
      },
      rooms: student.rooms ? student.rooms.map(room => ({
        id: room.id,
        roomNumber: room.roomNumber,
        capacity: room.capacity,
        isAvailable: room.isAvailable,
        teacher: room.teacher ? {
          id: room.teacher.id,
          name: room.teacher.name,
          email: room.teacher.email,
          registration: room.teacher.registration
        } : null
      })) : []
    }
  }
}