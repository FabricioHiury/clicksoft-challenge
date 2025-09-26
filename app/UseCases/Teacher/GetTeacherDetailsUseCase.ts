import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { TeacherResponseDTO } from 'App/DTOs/TeacherDTO'

export class GetTeacherDetailsUseCase {
  constructor(
    private teacherRepository: ITeacherRepository
  ) {}

  async execute(teacherId: number): Promise<TeacherResponseDTO> {
    const teacher = await this.teacherRepository.findById(teacherId)
    
    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      registration: teacher.registration,
      birth_date: teacher.birthDate.toFormat('yyyy-MM-dd'),
      created_at: teacher.createdAt.toString(),
      updated_at: teacher.updatedAt.toString()
    }
  }
}