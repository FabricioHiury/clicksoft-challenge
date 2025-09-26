import Factory from '@ioc:Adonis/Lucid/Factory'
import Room from 'App/Models/Room'
import { TeacherFactory } from './TeacherFactory'

export const RoomFactory = Factory.define(Room, ({ faker }) => {
  return {
    roomNumber: faker.string.numeric(3) + faker.string.numeric(3), 
    capacity: faker.number.int({ min: 10, max: 50 }),
    isAvailable: faker.datatype.boolean()
  }
})
.relation('teacher', () => TeacherFactory)
.build()