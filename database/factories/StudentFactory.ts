import Factory from '@ioc:Adonis/Lucid/Factory'
import Student from 'App/Models/Student'
import { DateTime } from 'luxon'

export const StudentFactory = Factory.define(Student, ({ faker }) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    registration: faker.string.alphanumeric(6).toUpperCase(),
    birthDate: DateTime.fromJSDate(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }))
  }
}).build()