import Factory from '@ioc:Adonis/Lucid/Factory'
import Teacher from 'App/Models/Teacher'
import { DateTime } from 'luxon'

export const TeacherFactory = Factory.define(Teacher, ({ faker }) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    registration: faker.string.alphanumeric(6).toUpperCase(),
    birthDate: DateTime.fromJSDate(faker.date.birthdate({ min: 25, max: 70, mode: 'age' }))
  }
}).build()