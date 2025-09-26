import { IStudentRepository } from 'App/Repositories/StudentRepository'
import { IRoomRepository } from 'App/Repositories/RoomRepository'
import { ValidationService } from './ValidationService'
import { 
  StudentAlreadyAllocatedException, 
  StudentNotAllocatedException 
} from 'App/Exceptions/Custom/StudentExceptions'

export class AllocationService {
  constructor(
    private studentRepository: IStudentRepository,
    private roomRepository: IRoomRepository,
    private validationService: ValidationService
  ) {}

  async allocateStudentToRoom(studentId: number, roomId: number): Promise<void> {
    await this.studentRepository.findById(studentId)
    
    await this.roomRepository.findById(roomId)
    
    const isAlreadyAllocated = await this.roomRepository.isStudentInRoom(studentId, roomId)
    if (isAlreadyAllocated) {
      throw new StudentAlreadyAllocatedException(studentId, roomId)
    }
    
    await this.validationService.validateRoomCapacity(roomId)
    
    await this.roomRepository.addStudentToRoom(studentId, roomId)
  }

  async deallocateStudentFromRoom(studentId: number, roomId: number): Promise<void> {
    await this.studentRepository.findById(studentId)
    
    await this.roomRepository.findById(roomId)
    
    const isAllocated = await this.roomRepository.isStudentInRoom(studentId, roomId)
    if (!isAllocated) {
      throw new StudentNotAllocatedException(studentId, roomId)
    }
    
    await this.roomRepository.removeStudentFromRoom(studentId, roomId)
  }
}