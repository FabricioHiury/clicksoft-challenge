import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { ValidationService } from 'App/Services/ValidationService'
import { CreateTeacherDTO, TeacherResponseDTO } from 'App/DTOs/TeacherDTO'

export class CreateTeacherUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private validationService: ValidationService
  ) {}

  async execute(data: CreateTeacherDTO): Promise<TeacherResponseDTO> {
    await this.validationService.validateTeacherEmailUniqueness(data.email)
    
    await this.validationService.validateTeacherRegistrationUniqueness(data.registration)
    
    const teacher = await this.teacherRepository.create(data)
    
    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      registration: teacher.registration,
      birth_date: teacher.birthDate.toString(),
      created_at: teacher.createdAt.toString(),
      updated_at: teacher.updatedAt.toString()
    }
  }
}