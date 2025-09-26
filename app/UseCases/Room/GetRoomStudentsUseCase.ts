import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { IRoomRepository } from 'App/Repositories/RoomRepository'

export interface GetRoomStudentsResponseDTO {
  room: {
    id: number
    roomNumber: string
    capacity: number
    isAvailable: boolean
  }
  students: Array<{
    id: number
    name: string
    email: string
    registration: string
    birth_date: string
    created_at: string
    updated_at: string
  }>
  totalStudents: number
  availableSpots: number
}

export class GetRoomStudentsUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private roomRepository: IRoomRepository
  ) {}

  public async execute(teacherId: number, roomId: number): Promise<GetRoomStudentsResponseDTO> {
    await this.teacherRepository.findById(teacherId)
    
    const room = await this.roomRepository.findById(roomId)
    
    if (room.teacherId !== teacherId) {
      throw new Error('Sala não pertence ao professor')
    }

    const students = await this.roomRepository.getStudentsInRoom(roomId)
    
    const studentsData = students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      registration: student.registration,
      birth_date: student.birthDate.toString(),
      created_at: student.createdAt.toString(),
      updated_at: student.updatedAt.toString()
    }))

    return {
      room: {
        id: room.id,
        roomNumber: room.roomNumber,
        capacity: room.capacity,
        isAvailable: room.isAvailable
      },
      students: studentsData,
      totalStudents: students.length,
      availableSpots: room.capacity - students.length
    }
  }
}