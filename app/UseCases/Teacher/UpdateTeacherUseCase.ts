import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { ValidationService } from 'App/Services/ValidationService'
import { UpdateTeacherDTO, TeacherResponseDTO } from 'App/DTOs/TeacherDTO'

export class UpdateTeacherUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private validationService: ValidationService
  ) {}

  async execute(id: number, data: UpdateTeacherDTO): Promise<TeacherResponseDTO> {
    if (data.email) {
      await this.validationService.validateTeacherEmailUniqueness(data.email, id)
    }
    
    if (data.registration) {
      await this.validationService.validateTeacherRegistrationUniqueness(data.registration, id)
    }
    
    const teacher = await this.teacherRepository.update(id, data)
    
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