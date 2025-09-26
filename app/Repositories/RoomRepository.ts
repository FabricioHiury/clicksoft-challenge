import Room from 'App/Models/Room'
import Student from 'App/Models/Student'
import { CreateRoomDTO, UpdateRoomDTO } from 'App/DTOs/RoomDTO'
import { RoomNotFoundException } from 'App/Exceptions/Custom/RoomExceptions'

export interface IRoomRepository {
  findAll(page: number, perPage: number): Promise<any>
  findAvailable(page: number, perPage: number): Promise<any>
  findById(id: number): Promise<Room>
  findByIdWithRelations(id: number): Promise<Room>
  create(data: CreateRoomDTO): Promise<Room>
  update(id: number, data: UpdateRoomDTO): Promise<Room>
  delete(id: number): Promise<void>
  getStudentsInRoom(roomId: number): Promise<Student[]>
  isStudentInRoom(studentId: number, roomId: number): Promise<boolean>
  addStudentToRoom(studentId: number, roomId: number): Promise<void>
  removeStudentFromRoom(studentId: number, roomId: number): Promise<void>
  getStudentCount(roomId: number): Promise<number>
}

export class RoomRepository implements IRoomRepository {
  async findAll(page: number = 1, perPage: number = 10) {
    return await Room.query()
      .preload('teacher')
      .preload('students')
      .paginate(page, perPage)
  }

  async findAvailable(page: number = 1, perPage: number = 10) {
    return await Room.query()
      .where('is_available', true)
      .orderBy('room_number', 'asc')
      .preload('teacher')
      .preload('students')
      .paginate(page, perPage)
  }

  async findById(id: number): Promise<Room> {
    const room = await Room.find(id)
    if (!room) {
      throw new RoomNotFoundException(id)
    }
    return room
  }

  async findByIdWithRelations(id: number): Promise<Room> {
    const room = await Room.query()
      .where('id', id)
      .preload('teacher')
      .preload('students')
      .first()
    
    if (!room) {
      throw new RoomNotFoundException(id)
    }
    return room
  }

  async create(data: CreateRoomDTO): Promise<Room> {
    return await Room.create(data)
  }

  async update(id: number, data: UpdateRoomDTO): Promise<Room> {
    const room = await this.findById(id)
    room.merge(data)
    await room.save()
    return room
  }

  async delete(id: number): Promise<void> {
    const room = await this.findById(id)
    await room.delete()
  }

  async getStudentsInRoom(roomId: number): Promise<Student[]> {
    const room = await this.findByIdWithRelations(roomId)
    return room.students
  }

  async isStudentInRoom(studentId: number, roomId: number): Promise<boolean> {
    const room = await Room.query()
      .where('id', roomId)
      .whereHas('students', (query) => {
        query.where('student_id', studentId)
      })
      .first()
    
    return !!room
  }

  async addStudentToRoom(studentId: number, roomId: number): Promise<void> {
    const room = await this.findById(roomId)
    await room.related('students').attach([studentId])
  }

  async removeStudentFromRoom(studentId: number, roomId: number): Promise<void> {
    const room = await this.findById(roomId)
    await room.related('students').detach([studentId])
  }

  async getStudentCount(roomId: number): Promise<number> {
    const room = await Room.query()
      .where('id', roomId)
      .withCount('students')
      .first()
    
    if (!room) {
      throw new RoomNotFoundException(roomId)
    }
    
    return room.$extras.students_count || 0
  }
}