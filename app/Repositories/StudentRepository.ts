import Student from 'App/Models/Student'
import { CreateStudentDTO, UpdateStudentDTO } from 'App/DTOs/StudentDTO'
import { StudentNotFoundException } from 'App/Exceptions/Custom/StudentExceptions'

export interface IStudentRepository {
  findAll(page: number, perPage: number): Promise<any>
  findById(id: number): Promise<Student>
  findByIdWithRooms(id: number): Promise<Student>
  create(data: CreateStudentDTO): Promise<Student>
  update(id: number, data: UpdateStudentDTO): Promise<Student>
  delete(id: number): Promise<void>
  findByEmail(email: string): Promise<Student | null>
  findByRegistration(registration: string): Promise<Student | null>
  findByEmailExcludingId(email: string, id: number): Promise<Student | null>
  findByRegistrationExcludingId(registration: string, id: number): Promise<Student | null>
}

export class StudentRepository implements IStudentRepository {
  async findAll(page: number = 1, perPage: number = 10) {
    return await Student.query().paginate(page, perPage)
  }

  async findById(id: number): Promise<Student> {
    const student = await Student.find(id)
    if (!student) {
      throw new StudentNotFoundException(id)
    }
    return student
  }

  async findByIdWithRooms(id: number): Promise<Student> {
    const student = await Student.query()
      .where('id', id)
      .preload('rooms', (roomQuery) => {
        roomQuery.preload('teacher')
      })
      .first()
    
    if (!student) {
      throw new StudentNotFoundException(id)
    }
    return student
  }

  async create(data: CreateStudentDTO): Promise<Student> {
    return await Student.create(data)
  }

  async update(id: number, data: UpdateStudentDTO): Promise<Student> {
    const student = await this.findById(id)
    student.merge(data)
    await student.save()
    return student
  }

  async delete(id: number): Promise<void> {
    const student = await this.findById(id)
    await student.delete()
  }

  async findByEmail(email: string): Promise<Student | null> {
    return await Student.findBy('email', email)
  }

  async findByRegistration(registration: string): Promise<Student | null> {
    return await Student.findBy('registration', registration)
  }

  async findByEmailExcludingId(email: string, id: number): Promise<Student | null> {
    return await Student.query()
      .where('email', email)
      .whereNot('id', id)
      .first()
  }

  async findByRegistrationExcludingId(registration: string, id: number): Promise<Student | null> {
    return await Student.query()
      .where('registration', registration)
      .whereNot('id', id)
      .first()
  }
}