import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { AllocationService } from 'App/Services/AllocationService'
import { AllocateStudentToTeacherDTO } from 'App/DTOs/TeacherDTO'

export class AllocateStudentUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private allocationService: AllocationService
  ) {}

  async execute(data: AllocateStudentToTeacherDTO): Promise<{ message: string }> {
    await this.teacherRepository.findById(data.teacher_id)
    
    await this.allocationService.allocateStudentToRoom(data.student_id, data.room_id)
    
    return {
      message: `Student ${data.student_id} successfully allocated to room ${data.room_id}`
    }
  }
}