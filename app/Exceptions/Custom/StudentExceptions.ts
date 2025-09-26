import { BusinessException } from './BusinessException'

export class StudentNotFoundException extends BusinessException {
  constructor(id: number) {
    super(`Student with ID ${id} not found`, 404, 'E_STUDENT_NOT_FOUND')
  }
}

export class StudentAlreadyAllocatedException extends BusinessException {
  constructor(studentId: number, roomId: number) {
    super(`Student ${studentId} is already allocated to room ${roomId}`, 409, 'E_STUDENT_ALREADY_ALLOCATED')
  }
}

export class StudentNotAllocatedException extends BusinessException {
  constructor(studentId: number, roomId: number) {
    super(`Student ${studentId} is not allocated to room ${roomId}`, 409, 'E_STUDENT_NOT_ALLOCATED')
  }
}

export class StudentEmailAlreadyExistsException extends BusinessException {
  constructor(email: string) {
    super(`Student with email ${email} already exists`, 409, 'E_STUDENT_EMAIL_EXISTS')
  }
}

export class StudentRegistrationAlreadyExistsException extends BusinessException {
  constructor(registration: string) {
    super(`Student with registration ${registration} already exists`, 409, 'E_STUDENT_REGISTRATION_EXISTS')
  }
}