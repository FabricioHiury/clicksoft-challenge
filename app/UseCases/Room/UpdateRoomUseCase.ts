import { UpdateRoomDTO, RoomResponseDTO } from 'App/DTOs/RoomDTO'
import { IRoomRepository } from 'App/Repositories/RoomRepository'
import { ITeacherRepository } from 'App/Repositories/TeacherRepository'

export class UpdateRoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private teacherRepository: ITeacherRepository
  ) {}

  public async execute(roomId: number, teacherId: number, data: UpdateRoomDTO): Promise<RoomResponseDTO> {
    await this.teacherRepository.findById(teacherId)
    
    const room = await this.roomRepository.findById(roomId)
    
    if (room.teacherId !== teacherId) {
      throw new Error('Sala não pertence ao professor')
    }

    const updatedRoom = await this.roomRepository.update(roomId, data)

    return {
      id: updatedRoom.id,
      room_number: updatedRoom.roomNumber,
      capacity: updatedRoom.capacity,
      is_available: updatedRoom.isAvailable,
      teacher_id: updatedRoom.teacherId,
      created_at: updatedRoom.createdAt.toString(),
      updated_at: updatedRoom.updatedAt.toString()
    }
  }
}