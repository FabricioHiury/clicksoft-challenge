import { BusinessException } from './BusinessException'

export class TeacherNotFoundException extends BusinessException {
  constructor(id: number) {
    super(`Teacher with ID ${id} not found`, 404, 'E_TEACHER_NOT_FOUND')
  }
}

export class TeacherEmailAlreadyExistsException extends BusinessException {
  constructor(email: string) {
    super(`Teacher with email ${email} already exists`, 409, 'E_TEACHER_EMAIL_EXISTS')
  }
}

export class TeacherRegistrationAlreadyExistsException extends BusinessException {
  constructor(registration: string) {
    super(`Teacher with registration ${registration} already exists`, 409, 'E_TEACHER_REGISTRATION_EXISTS')
  }
}

export class TeacherHasRoomsException extends BusinessException {
  constructor(teacherId: number) {
    super(`Cannot delete teacher ${teacherId} because they have rooms assigned`, 409, 'E_TEACHER_HAS_ROOMS')
  }
}