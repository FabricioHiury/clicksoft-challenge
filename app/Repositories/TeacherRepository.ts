import Teacher from 'App/Models/Teacher'
import { CreateTeacherDTO, UpdateTeacherDTO } from 'App/DTOs/TeacherDTO'
import { TeacherNotFoundException } from 'App/Exceptions/Custom/TeacherExceptions'

export interface ITeacherRepository {
  findAll(page: number, perPage: number): Promise<any>
  findById(id: number): Promise<Teacher>
  create(data: CreateTeacherDTO): Promise<Teacher>
  update(id: number, data: UpdateTeacherDTO): Promise<Teacher>
  delete(id: number): Promise<void>
  findByEmail(email: string): Promise<Teacher | null>
  findByRegistration(registration: string): Promise<Teacher | null>
  findByEmailExcludingId(email: string, id: number): Promise<Teacher | null>
  findByRegistrationExcludingId(registration: string, id: number): Promise<Teacher | null>
}

export class TeacherRepository implements ITeacherRepository {
  async findAll(page: number = 1, perPage: number = 10) {
    return await Teacher.query().paginate(page, perPage)
  }

  async findById(id: number): Promise<Teacher> {
    const teacher = await Teacher.find(id)
    if (!teacher) {
      throw new TeacherNotFoundException(id)
    }
    return teacher
  }

  async create(data: CreateTeacherDTO): Promise<Teacher> {
    return await Teacher.create(data)
  }

  async update(id: number, data: UpdateTeacherDTO): Promise<Teacher> {
    const teacher = await this.findById(id)
    teacher.merge(data)
    await teacher.save()
    return teacher
  }

  async delete(id: number): Promise<void> {
    const teacher = await this.findById(id)
    await teacher.delete()
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    return await Teacher.findBy('email', email)
  }

  async findByRegistration(registration: string): Promise<Teacher | null> {
    return await Teacher.findBy('registration', registration)
  }

  async findByEmailExcludingId(email: string, id: number): Promise<Teacher | null> {
    return await Teacher.query()
      .where('email', email)
      .whereNot('id', id)
      .first()
  }

  async findByRegistrationExcludingId(registration: string, id: number): Promise<Teacher | null> {
    return await Teacher.query()
      .where('registration', registration)
      .whereNot('id', id)
      .first()
  }
}