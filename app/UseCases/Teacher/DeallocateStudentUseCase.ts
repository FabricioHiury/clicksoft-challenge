import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { AllocationService } from 'App/Services/AllocationService'
import { DeallocateStudentFromTeacherDTO } from 'App/DTOs/TeacherDTO'

export class DeallocateStudentUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private allocationService: AllocationService
  ) {}

  async execute(data: DeallocateStudentFromTeacherDTO): Promise<{ message: string }> {
    await this.teacherRepository.findById(data.teacher_id)
    
    await this.allocationService.deallocateStudentFromRoom(data.student_id, data.room_id)
    
    return {
      message: `Student ${data.student_id} successfully deallocated from room ${data.room_id}`
    }
  }
}