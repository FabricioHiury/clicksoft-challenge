import { IRoomRepository } from 'App/Repositories/RoomRepository'
import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { CreateRoomDTO, RoomResponseDTO } from 'App/DTOs/RoomDTO'

export class CreateRoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private teacherRepository: ITeacherRepository
  ) {}

  async execute(data: CreateRoomDTO): Promise<RoomResponseDTO> {
    await this.teacherRepository.findById(data.teacher_id)
    
    const room = await this.roomRepository.create(data)
    
    const roomWithRelations = await this.roomRepository.findByIdWithRelations(room.id)
    
    return {
      id: roomWithRelations.id,
      room_number: roomWithRelations.roomNumber,
      is_available: roomWithRelations.isAvailable,
      capacity: roomWithRelations.capacity,
      teacher_id: roomWithRelations.teacherId,
      created_at: roomWithRelations.createdAt.toString(),
      updated_at: roomWithRelations.updatedAt.toString(),
      teacher: roomWithRelations.teacher ? {
        id: roomWithRelations.teacher.id,
        name: roomWithRelations.teacher.name,
        email: roomWithRelations.teacher.email,
        registration: roomWithRelations.teacher.registration
      } : undefined,
      students: roomWithRelations.students?.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        registration: student.registration
      }))
    }
  }
}