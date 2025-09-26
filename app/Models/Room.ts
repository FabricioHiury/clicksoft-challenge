import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Teacher from './Teacher'
import Student from './Student'

export default class Room extends BaseModel {
  public static table = 'rooms'

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'room_number', serializeAs: 'roomNumber' })
  public roomNumber: string

  @column()
  public capacity: number

  @column({ columnName: 'is_available', serializeAs: 'isAvailable' })
  public isAvailable: boolean

  @column({ columnName: 'teacher_id', serializeAs: 'teacherId' })
  public teacherId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Teacher)
  public teacher: BelongsTo<typeof Teacher>

  @manyToMany(() => Student, {
    pivotTable: 'student_rooms',
  })
  public students: ManyToMany<typeof Student>
}
