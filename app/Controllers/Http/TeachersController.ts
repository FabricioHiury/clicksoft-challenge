import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TeacherValidator, { TeacherUpdateValidator } from 'App/Validators/TeacherValidator'
import RoomValidator, { StudentAllocationValidator } from 'App/Validators/RoomValidator'
import { DependencyContainer } from 'App/Services/DependencyContainer'
import { CreateTeacherDTO, UpdateTeacherDTO } from 'App/DTOs/TeacherDTO'
import { CreateRoomDTO, UpdateRoomDTO } from 'App/DTOs/RoomDTO'

export default class TeachersController {
  private container: DependencyContainer

  constructor() {
    this.container = DependencyContainer.getInstance()
  }

  // RF02: Permitir cadastro de professores
  public async store(ctx: HttpContextContract) {
    try {
      const payload = await ctx.request.validate(TeacherValidator)
      const createData: CreateTeacherDTO = {
        name: payload.name,
        email: payload.email,
        registration: payload.registration,
        birth_date: payload.birthDate.toFormat('yyyy-MM-dd')
      }

      const teacher = await this.container.createTeacherUseCase.execute(createData)

      return ctx.response.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        data: teacher,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      const status = error.status || (error.messages ? 422 : 400)
      return ctx.response.status(status).json({
        success: false,
        message: 'Error creating teacher',
        error: error.message || error.messages,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF04: Permitir que professor consulte lista de professores cadastrados
  public async index(ctx: HttpContextContract) {
    try {
      const { page = 1, perPage = 10 } = ctx.request.qs()
      
      const teacherRepository = this.container.teacherRepository
      const teachers = await teacherRepository.findAll(page, perPage)
      
      const teachersData = teachers.all().map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        registration: teacher.registration,
        birth_date: teacher.birthDate.toString(),
        created_at: teacher.createdAt.toString(),
        updated_at: teacher.updatedAt.toString()
      }))

      return ctx.response.json({
        success: true,
        message: 'Teachers retrieved successfully',
        data: {
          data: teachersData,
          meta: {
            total: teachers.total,
            per_page: teachers.perPage,
            current_page: teachers.currentPage,
            last_page: teachers.lastPage,
            first_page: 1,
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return ctx.response.status(500).json({
        success: false,
        message: 'Error retrieving teachers',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF08: Permitir que professor consulte seus dados de cadastro
  public async show({ params, response }: HttpContextContract) {
    try {
      const teacherId = parseInt(params.id)
      const teacher = await this.container.getTeacherDetailsUseCase.execute(teacherId)

      return response.json({
        success: true,
        message: 'Teacher details retrieved successfully',
        data: teacher,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Teacher not found',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF02: Permitir atualização de dados de professores
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const id = parseInt(params.id)
      const payload = await request.validate(TeacherUpdateValidator)
      
      const updateData: UpdateTeacherDTO = {
        name: payload.name,
        email: payload.email,
        registration: payload.registration,
        birth_date: payload.birthDate.toFormat('yyyy-MM-dd')
      }

      const teacher = await this.container.updateTeacherUseCase.execute(id, updateData)

      return response.json({
        success: true,
        message: 'Teacher updated successfully',
        data: teacher,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error updating teacher',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF02: Permitir exclusão de professores
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const id = parseInt(params.id)
      await this.container.teacherRepository.delete(id)

      return response.json({
        success: true,
        message: 'Teacher deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error deleting teacher',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF06: Permitir que professor crie salas
  public async createRoom(ctx: HttpContextContract) {
    try {
      const payload = await ctx.request.validate(RoomValidator)
      const createData: CreateRoomDTO = {
        room_number: payload.roomNumber,
        capacity: payload.capacity,
        teacher_id: parseInt(ctx.params.id)
      }

      const room = await this.container.createRoomUseCase.execute(createData)

      return ctx.response.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: room,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return ctx.response.status(400).json({
        success: false,
        message: 'Error creating room',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF06: Permitir que professor atualize salas
  public async updateRoom({ params, request, response }: HttpContextContract) {
    try {
      const roomId = parseInt(params.roomId)
      const teacherId = parseInt(params.id)
      const payload = await request.validate(RoomValidator)
      
      const updateData: UpdateRoomDTO = {
        room_number: payload.roomNumber,
        capacity: payload.capacity,
        teacher_id: teacherId
      }

      const room = await this.container.updateRoomUseCase.execute(roomId, teacherId, updateData)

      return response.json({
        success: true,
        message: 'Room updated successfully',
        data: room,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error updating room',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF06: Permitir que professor exclua salas
  public async deleteRoom({ params, response }: HttpContextContract) {
    try {
      const roomId = parseInt(params.roomId)
      const teacherId = parseInt(params.id)

      await this.container.deleteRoomUseCase.execute(roomId, teacherId)

      return response.json({
        success: true,
        message: 'Room deleted successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error deleting room',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF07: Permitir que professor consulte suas salas
  public async getRooms({ params, response }: HttpContextContract) {
    try {
      const teacherId = parseInt(params.id)
      const rooms = await this.container.getRoomsUseCase.execute(teacherId)

      return response.json({
        success: true,
        message: 'Teacher rooms retrieved successfully',
        data: rooms,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error retrieving teacher rooms',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF08: Permitir que professor aloque alunos em suas salas
  public async allocateStudent({ params, request, response }: HttpContextContract) {
    try {
      const teacherId = parseInt(params.id)
      const payload = await request.validate(StudentAllocationValidator)
      
      const allocationData = {
        teacher_id: teacherId,
        student_id: payload.studentId,
        room_id: parseInt(params.roomId)
      }

      const result = await this.container.allocateStudentUseCase.execute(allocationData)

      return response.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error allocating student',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF08: Permitir que professor desaloque alunos de suas salas
  public async deallocateStudent({ params, request, response }: HttpContextContract) {
    try {
      const teacherId = parseInt(params.id)
      const payload = await request.validate(StudentAllocationValidator)
      
      const deallocationData = {
        teacher_id: teacherId,
        student_id: payload.studentId,
        room_id: parseInt(params.roomId)
      }

      const result = await this.container.deallocateStudentUseCase.execute(deallocationData)

      return response.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error deallocating student',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  // RF07: Permitir que professor consulte alunos de uma sala específica
  public async getRoomStudents({ params, response }: HttpContextContract) {
    try {
      const teacherId = parseInt(params.id)
      const roomId = parseInt(params.roomId)

      const result = await this.container.getRoomStudentsUseCase.execute(teacherId, roomId)

      return response.json({
        success: true,
        message: 'Room students retrieved successfully',
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error retrieving room students',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }
}
