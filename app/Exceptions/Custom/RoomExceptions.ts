import { BusinessException } from './BusinessException'

export class RoomNotFoundException extends BusinessException {
  constructor(id: number) {
    super(`Room with ID ${id} not found`, 404, 'E_ROOM_NOT_FOUND')
  }
}

export class RoomCapacityExceededException extends BusinessException {
  constructor(roomId: number, capacity: number) {
    super(`Room ${roomId} has reached its maximum capacity of ${capacity} students`, 409, 'E_ROOM_CAPACITY_EXCEEDED')
  }
}

export class RoomHasStudentsException extends BusinessException {
  constructor(roomId: number) {
    super(`Cannot delete room ${roomId} because it has students allocated`, 409, 'E_ROOM_HAS_STUDENTS')
  }
}