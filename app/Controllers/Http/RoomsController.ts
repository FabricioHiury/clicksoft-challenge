import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DependencyContainer } from 'App/Services/DependencyContainer'
import RoomValidator from 'App/Validators/RoomValidator'
import { DateTime } from 'luxon'

export default class RoomsController {
  private container: DependencyContainer

  constructor() {
    this.container = DependencyContainer.getInstance()
  }

  public async getAvailableRooms({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const result = await this.container.getAvailableRoomsUseCase.execute(page, limit)

      return response.status(200).json({
        success: true,
        message: 'Available rooms retrieved successfully',
        data: result.data,
        meta: result.meta,
        timestamp: DateTime.now().toString()
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to retrieve available rooms',
        error: error.message,
        timestamp: DateTime.now().toString()
      })
    }
  }

  public async index({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const result = await this.container.getAllRoomsUseCase.execute(page, limit)

      return response.status(200).json({
        success: true,
        message: 'All rooms retrieved successfully',
        data: result.data,
        meta: result.meta,
        timestamp: DateTime.now().toString()
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to retrieve rooms',
        error: error.message,
        timestamp: DateTime.now().toString()
      })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const roomId = parseInt(params.id)
      
      const room = await this.container.getRoomDetailsUseCase.execute(roomId)

      if (!room) {
        return response.status(404).json({
          success: false,
          message: 'Room not found',
          timestamp: DateTime.now().toString()
        })
      }

      return response.status(200).json({
        success: true,
        message: 'Room details retrieved successfully',
        data: room,
        timestamp: DateTime.now().toString()
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to retrieve room details',
        error: error.message,
        timestamp: DateTime.now().toString()
      })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(RoomValidator)
      
      const createRoomData = {
        room_number: payload.roomNumber,
        capacity: payload.capacity,
        teacher_id: 1 
      }
      
      const room = await this.container.createRoomUseCase.execute(createRoomData)

      return response.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: room,
        timestamp: DateTime.now().toString()
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to create room',
        error: error.message,
        timestamp: DateTime.now().toString()
      })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const roomId = parseInt(params.id)
      const teacherId = 1 // This should come from authenticated teacher context
      const payload = await request.validate(RoomValidator)
      
      // Map validator payload to UpdateRoomDTO format
      const updateRoomData = {
        room_number: payload.roomNumber,
        capacity: payload.capacity
      }
      
      const room = await this.container.updateRoomUseCase.execute(roomId, teacherId, updateRoomData)

      return response.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: room,
        timestamp: DateTime.now().toString()
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to update room',
        error: error.message,
        timestamp: DateTime.now().toString()
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const roomId = parseInt(params.id)
      const teacherId = 1 // This should come from authenticated teacher context
      
      await this.container.deleteRoomUseCase.execute(roomId, teacherId)

      return response.status(200).json({
        success: true,
        message: 'Room deleted successfully',
        timestamp: DateTime.now().toString()
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to delete room',
        error: error.message,
        timestamp: DateTime.now().toString()
      })
    }
  }
}
