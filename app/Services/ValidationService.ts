import { IStudentRepository } from 'App/Repositories/StudentRepository'
import { ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { IRoomRepository } from 'App/Repositories/RoomRepository'
import { 
  StudentEmailAlreadyExistsException, 
  StudentRegistrationAlreadyExistsException 
} from 'App/Exceptions/Custom/StudentExceptions'
import { 
  TeacherEmailAlreadyExistsException, 
  TeacherRegistrationAlreadyExistsException 
} from 'App/Exceptions/Custom/TeacherExceptions'
import { RoomCapacityExceededException } from 'App/Exceptions/Custom/RoomExceptions'

export class ValidationService {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
    private roomRepository: IRoomRepository
  ) {}

  async validateStudentEmailUniqueness(email: string, excludeId?: number): Promise<void> {
    const existingStudent = excludeId 
      ? await this.studentRepository.findByEmailExcludingId(email, excludeId)
      : await this.studentRepository.findByEmail(email)
    
    if (existingStudent) {
      throw new StudentEmailAlreadyExistsException(email)
    }
  }

  async validateStudentRegistrationUniqueness(registration: string, excludeId?: number): Promise<void> {
    const existingStudent = excludeId 
      ? await this.studentRepository.findByRegistrationExcludingId(registration, excludeId)
      : await this.studentRepository.findByRegistration(registration)
    
    if (existingStudent) {
      throw new StudentRegistrationAlreadyExistsException(registration)
    }
  }

  async validateTeacherEmailUniqueness(email: string, excludeId?: number): Promise<void> {
    const existingTeacher = excludeId 
      ? await this.teacherRepository.findByEmailExcludingId(email, excludeId)
      : await this.teacherRepository.findByEmail(email)
    
    if (existingTeacher) {
      throw new TeacherEmailAlreadyExistsException(email)
    }
  }

  async validateTeacherRegistrationUniqueness(registration: string, excludeId?: number): Promise<void> {
    const existingTeacher = excludeId 
      ? await this.teacherRepository.findByRegistrationExcludingId(registration, excludeId)
      : await this.teacherRepository.findByRegistration(registration)
    
    if (existingTeacher) {
      throw new TeacherRegistrationAlreadyExistsException(registration)
    }
  }

  async validateRoomCapacity(roomId: number): Promise<void> {
    const room = await this.roomRepository.findById(roomId)
    const currentStudentCount = await this.roomRepository.getStudentCount(roomId)
    
    if (currentStudentCount >= room.capacity) {
      throw new RoomCapacityExceededException(roomId, room.capacity)
    }
  }
}