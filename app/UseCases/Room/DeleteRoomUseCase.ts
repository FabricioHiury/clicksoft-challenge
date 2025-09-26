import { IRoomRepository } from 'App/Repositories/RoomRepository'
import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { RoomHasStudentsException } from 'App/Exceptions/Custom/RoomExceptions'

export class DeleteRoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private teacherRepository: ITeacherRepository
  ) {}

  public async execute(roomId: number, teacherId: number): Promise<{ message: string }> {
    await this.teacherRepository.findById(teacherId)
    
    const room = await this.roomRepository.findById(roomId)
    
    if (room.teacherId !== teacherId) {
      throw new Error('Sala não pertence ao professor')
    }

    const studentCount = await this.roomRepository.getStudentCount(roomId)
    if (studentCount > 0) {
      throw new RoomHasStudentsException(roomId)
    }

    await this.roomRepository.delete(roomId)

    return {
      message: 'Sala excluída com sucesso'
    }
  }
}