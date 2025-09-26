import { IStudentRepository } from 'App/Repositories/StudentRepository'
import { ValidationService } from 'App/Services/ValidationService'
import { UpdateStudentDTO, StudentResponseDTO } from 'App/DTOs/StudentDTO'

export class UpdateStudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private validationService: ValidationService
  ) {}

  async execute(id: number, data: UpdateStudentDTO): Promise<StudentResponseDTO> {
    if (data.email) {
      await this.validationService.validateStudentEmailUniqueness(data.email, id)
    }
    
    if (data.registration) {
      await this.validationService.validateStudentRegistrationUniqueness(data.registration, id)
    }
    
    const student = await this.studentRepository.update(id, data)
    
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      registration: student.registration,
      birth_date: student.birthDate?.toString() || '',
      created_at: student.createdAt?.toString() || '',
      updated_at: student.updatedAt?.toString() || ''
    }
  }
}