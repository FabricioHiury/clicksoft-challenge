import { IStudentRepository } from 'App/Repositories/StudentRepository'
import { ValidationService } from 'App/Services/ValidationService'
import { CreateStudentDTO, StudentResponseDTO } from 'App/DTOs/StudentDTO'

export class CreateStudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private validationService: ValidationService
  ) {}

  async execute(data: CreateStudentDTO): Promise<StudentResponseDTO> {
    await this.validationService.validateStudentEmailUniqueness(data.email)
    
    await this.validationService.validateStudentRegistrationUniqueness(data.registration)
    
    const student = await this.studentRepository.create(data)
    
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      registration: student.registration,
      birth_date: student.birthDate.toString(),
      created_at: student.createdAt.toString(),
      updated_at: student.updatedAt.toString()
    }
  }
}