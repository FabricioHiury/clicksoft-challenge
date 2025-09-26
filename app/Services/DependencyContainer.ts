import { StudentRepository, IStudentRepository } from 'App/Repositories/StudentRepository'
import { TeacherRepository, ITeacherRepository } from 'App/Repositories/TeacherRepository'
import { RoomRepository, IRoomRepository } from 'App/Repositories/RoomRepository'
import { ValidationService } from 'App/Services/ValidationService'
import { AllocationService } from 'App/Services/AllocationService'
import { CreateStudentUseCase } from 'App/UseCases/Student/CreateStudentUseCase'
import { UpdateStudentUseCase } from 'App/UseCases/Student/UpdateStudentUseCase'
import { CreateTeacherUseCase } from 'App/UseCases/Teacher/CreateTeacherUseCase'
import { UpdateTeacherUseCase } from 'App/UseCases/Teacher/UpdateTeacherUseCase'
import { AllocateStudentUseCase } from 'App/UseCases/Teacher/AllocateStudentUseCase'
import { DeallocateStudentUseCase } from 'App/UseCases/Teacher/DeallocateStudentUseCase'
import { GetTeacherDetailsUseCase } from 'App/UseCases/Teacher/GetTeacherDetailsUseCase'
import { CreateRoomUseCase } from 'App/UseCases/Room/CreateRoomUseCase'
import { UpdateRoomUseCase } from 'App/UseCases/Room/UpdateRoomUseCase'
import { DeleteRoomUseCase } from 'App/UseCases/Room/DeleteRoomUseCase'
import { GetRoomsUseCase } from 'App/UseCases/Room/GetRoomsUseCase'
import { GetRoomStudentsUseCase } from 'App/UseCases/Room/GetRoomStudentsUseCase'
import { GetAvailableRoomsUseCase } from 'App/UseCases/Room/GetAvailableRoomsUseCase'
import { GetAllRoomsUseCase } from 'App/UseCases/Room/GetAllRoomsUseCase'
import { GetRoomDetailsUseCase } from 'App/UseCases/Room/GetRoomDetailsUseCase'
import { GetStudentRoomsUseCase } from 'App/UseCases/Student/GetStudentRoomsUseCase'

export class DependencyContainer {
  private static instance: DependencyContainer
  
  // Repositories
  private _studentRepository: IStudentRepository
  private _teacherRepository: ITeacherRepository
  private _roomRepository: IRoomRepository
  
  // Services
  private _validationService: ValidationService
  private _allocationService: AllocationService
  
  // Use Cases - Student
  private _createStudentUseCase: CreateStudentUseCase
  private _updateStudentUseCase: UpdateStudentUseCase
  private _getStudentRoomsUseCase: GetStudentRoomsUseCase
  
  // Use Cases - Teacher
  private _createTeacherUseCase: CreateTeacherUseCase
  private _updateTeacherUseCase: UpdateTeacherUseCase
  private _allocateStudentUseCase: AllocateStudentUseCase
  private _deallocateStudentUseCase: DeallocateStudentUseCase
  private _getTeacherDetailsUseCase: GetTeacherDetailsUseCase
  
  // Use Cases - Room
  private _createRoomUseCase: CreateRoomUseCase
  private _updateRoomUseCase: UpdateRoomUseCase
  private _deleteRoomUseCase: DeleteRoomUseCase
  private _getRoomsUseCase: GetRoomsUseCase
  private _getRoomStudentsUseCase: GetRoomStudentsUseCase
  private _getAvailableRoomsUseCase: GetAvailableRoomsUseCase
  private _getAllRoomsUseCase: GetAllRoomsUseCase
  private _getRoomDetailsUseCase: GetRoomDetailsUseCase

  private constructor() {
    this.initializeRepositories()
    this.initializeServices()
    this.initializeUseCases()
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer()
    }
    return DependencyContainer.instance
  }

  private initializeRepositories(): void {
    this._studentRepository = new StudentRepository()
    this._teacherRepository = new TeacherRepository()
    this._roomRepository = new RoomRepository()
  }

  private initializeServices(): void {
    this._validationService = new ValidationService(
      this._studentRepository,
      this._teacherRepository,
      this._roomRepository
    )
    
    this._allocationService = new AllocationService(
      this._studentRepository,
      this._roomRepository,
      this._validationService
    )
  }

  private initializeUseCases(): void {
    // Student Use Cases
    this._createStudentUseCase = new CreateStudentUseCase(
      this._studentRepository,
      this._validationService
    )
    
    this._updateStudentUseCase = new UpdateStudentUseCase(
      this._studentRepository,
      this._validationService
    )
    
    // Teacher Use Cases
    this._createTeacherUseCase = new CreateTeacherUseCase(
      this._teacherRepository,
      this._validationService
    )
    
    this._updateTeacherUseCase = new UpdateTeacherUseCase(
      this._teacherRepository,
      this._validationService
    )
    
    this._allocateStudentUseCase = new AllocateStudentUseCase(
      this._teacherRepository,
      this._allocationService
    )
    
    this._deallocateStudentUseCase = new DeallocateStudentUseCase(
      this._teacherRepository,
      this._allocationService
    )
    
    this._getTeacherDetailsUseCase = new GetTeacherDetailsUseCase(
      this._teacherRepository
    )
    
    // Room Use Cases
    this._createRoomUseCase = new CreateRoomUseCase(
      this._roomRepository,
      this._teacherRepository
    )
    
    this._updateRoomUseCase = new UpdateRoomUseCase(
      this._roomRepository,
      this._teacherRepository
    )
    
    this._deleteRoomUseCase = new DeleteRoomUseCase(
      this._roomRepository,
      this._teacherRepository
    )
    
    this._getRoomsUseCase = new GetRoomsUseCase(
      this._teacherRepository,
      this._roomRepository
    )
    
    this._getRoomStudentsUseCase = new GetRoomStudentsUseCase(
      this._teacherRepository,
      this._roomRepository
    )
    
    this._getAvailableRoomsUseCase = new GetAvailableRoomsUseCase(
      this._roomRepository
    )
    
    this._getAllRoomsUseCase = new GetAllRoomsUseCase(
      this._roomRepository
    )
    
    this._getRoomDetailsUseCase = new GetRoomDetailsUseCase(
      this._roomRepository
    )
    
    this._getStudentRoomsUseCase = new GetStudentRoomsUseCase(
      this._studentRepository
    )
  }

  // Repository Getters
  public get studentRepository(): IStudentRepository {
    return this._studentRepository
  }

  public get teacherRepository(): ITeacherRepository {
    return this._teacherRepository
  }

  public get roomRepository(): IRoomRepository {
    return this._roomRepository
  }

  // Service Getters
  public get validationService(): ValidationService {
    return this._validationService
  }

  public get allocationService(): AllocationService {
    return this._allocationService
  }

  // Use Case Getters - Student
  public get createStudentUseCase(): CreateStudentUseCase {
    return this._createStudentUseCase
  }

  public get updateStudentUseCase(): UpdateStudentUseCase {
    return this._updateStudentUseCase
  }

  // Use Case Getters - Teacher
  public get createTeacherUseCase(): CreateTeacherUseCase {
    return this._createTeacherUseCase
  }

  public get updateTeacherUseCase(): UpdateTeacherUseCase {
    return this._updateTeacherUseCase
  }

  public get allocateStudentUseCase(): AllocateStudentUseCase {
    return this._allocateStudentUseCase
  }

  public get deallocateStudentUseCase(): DeallocateStudentUseCase {
    return this._deallocateStudentUseCase
  }

  public get getTeacherDetailsUseCase(): GetTeacherDetailsUseCase {
    return this._getTeacherDetailsUseCase
  }

  // Use Case Getters - Room
  public get createRoomUseCase(): CreateRoomUseCase {
    return this._createRoomUseCase
  }

  public get updateRoomUseCase(): UpdateRoomUseCase {
    return this._updateRoomUseCase
  }

  public get deleteRoomUseCase(): DeleteRoomUseCase {
    return this._deleteRoomUseCase
  }

  public get getRoomsUseCase(): GetRoomsUseCase {
    return this._getRoomsUseCase
  }

  public get getRoomStudentsUseCase(): GetRoomStudentsUseCase {
    return this._getRoomStudentsUseCase
  }

  public get getAvailableRoomsUseCase(): GetAvailableRoomsUseCase {
    return this._getAvailableRoomsUseCase
  }

  public get getAllRoomsUseCase(): GetAllRoomsUseCase {
    return this._getAllRoomsUseCase
  }

  public get getRoomDetailsUseCase(): GetRoomDetailsUseCase {
    return this._getRoomDetailsUseCase
  }

  public get getStudentRoomsUseCase(): GetStudentRoomsUseCase {
    return this._getStudentRoomsUseCase
  }
}