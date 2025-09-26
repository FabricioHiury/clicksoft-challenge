import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DependencyContainer } from 'App/Services/DependencyContainer'
import { CreateStudentDTO, UpdateStudentDTO } from 'App/DTOs/StudentDTO'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class StudentsController {
  private container = DependencyContainer.getInstance()

  // RF01: Permitir que aluno se cadastre na aplicação
  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          name: schema.string({ trim: true }, [
            rules.minLength(2),
            rules.maxLength(100)
          ]),
          email: schema.string({ trim: true }, [
            rules.email(),
            rules.unique({ table: 'students', column: 'email' })
          ]),
          registration: schema.string({ trim: true }, [
            rules.minLength(3),
            rules.maxLength(20),
            rules.unique({ table: 'students', column: 'registration' })
          ]),
          birthDate: schema.date({
            format: 'yyyy-MM-dd'
          }, [
            rules.before('today')
          ])
        }),
        messages: {
          'name.required': 'Name is required',
          'name.minLength': 'Name must be at least 2 characters',
          'name.maxLength': 'Name must be at most 100 characters',
          'email.required': 'Email is required',
          'email.email': 'Email must be valid',
          'email.unique': 'This email is already registered',
          'registration.required': 'Registration is required',
          'registration.minLength': 'Registration must be at least 3 characters',
          'registration.maxLength': 'Registration must be at most 20 characters',
          'registration.unique': 'This registration is already registered',
          'birthDate.required': 'Birth date is required',
          'birthDate.date': 'Birth date must be a valid date',
          'birthDate.before': 'Birth date must be before today'
        }
      })

      const data: CreateStudentDTO = {
        name: payload.name,
        email: payload.email,
        registration: payload.registration,
        birth_date: payload.birthDate.toFormat('yyyy-MM-dd')
      }

      const student = await this.container.createStudentUseCase.execute(data)

      return response.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      const status = error.status || (error.messages ? 422 : 400)
      return response.status(status).json({
        success: false,
        message: error.message || 'Error creating student',
        error: error.code || error.messages || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF04: Permitir que aluno consulte seus dados de cadastro
  public async show({ params, response }: HttpContextContract) {
    try {
      const student = await this.container.studentRepository.findById(params.id)
      
      return response.json({
        success: true,
        message: 'Student data retrieved successfully',
        data: {
          id: student.id,
          name: student.name,
          email: student.email,
          registration: student.registration,
          birthDate: student.birthDate.toString(),
          createdAt: student.createdAt.toString(),
          updatedAt: student.updatedAt.toString()
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(error.status || 404).json({
        success: false,
        message: error.message || 'Student not found',
        error: error.code || 'E_STUDENT_NOT_FOUND',
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF02: Permitir que aluno edite seus dados de cadastro
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const data: UpdateStudentDTO = {
        name: request.input('name'),
        email: request.input('email'),
        registration: request.input('registration'),
        birth_date: request.input('birth_date')
      }

      const student = await this.container.updateStudentUseCase.execute(params.id, data)

      return response.json({
        success: true,
        message: 'Student data updated successfully',
        data: student,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(error.status || 400).json({
        success: false,
        message: error.message || 'Error updating student',
        error: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF03: Permitir que aluno exclua seus dados de cadastro
  public async destroy({ params, response }: HttpContextContract) {
    try {
      await this.container.studentRepository.delete(params.id)

      return response.json({
        success: true,
        message: 'Student account deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(error.status || 404).json({
        success: false,
        message: error.message || 'Student not found',
        error: error.code || 'E_STUDENT_NOT_FOUND',
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF05: Permitir que aluno consulte lista de alunos cadastrados
  public async index({ request, response }: HttpContextContract) {
    try {
      const { page = 1, perPage = 10 } = request.qs()
      
      const students = await this.container.studentRepository.findAll(page, perPage)
      
      const studentsData = students.all().map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        registration: student.registration,
        birthDate: student.birthDate.toString(),
        createdAt: student.createdAt.toString(),
        updatedAt: student.updatedAt.toString()
      }))

      return response.json({
        success: true,
        message: 'Students retrieved successfully',
        data: studentsData,
        meta: {
          total: students.total,
          perPage: students.perPage,
          currentPage: students.currentPage,
          lastPage: students.lastPage,
          firstPage: 1,
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error retrieving students list',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF06: Permitir que aluno consulte as salas em que está matriculado
  public async getRooms({ params, response }: HttpContextContract) {
    try {
      const result = await this.container.getStudentRoomsUseCase.execute(params.id)

      return response.json({
        success: true,
        message: 'Student rooms retrieved successfully',
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Student not found',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }
}
