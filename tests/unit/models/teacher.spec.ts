import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Teacher from 'App/Models/Teacher'
import Room from 'App/Models/Room'
import { DateTime } from 'luxon'

test.group('Teacher Model', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a teacher with valid data', async ({ assert }) => {
    const teacherData = {
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    }

    const teacher = await Teacher.create(teacherData)

    assert.exists(teacher.id)
    assert.equal(teacher.name, teacherData.name)
    assert.equal(teacher.email, teacherData.email)
    assert.equal(teacher.registration, teacherData.registration)
    assert.equal(teacher.birthDate.toISODate(), '1980-01-15')
  })

  test('should have timestamps', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    assert.exists(teacher.createdAt)
    assert.exists(teacher.updatedAt)
    assert.isTrue(teacher.createdAt instanceof DateTime)
    assert.isTrue(teacher.updatedAt instanceof DateTime)
  })

  test('should serialize dates correctly', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const serialized = teacher.serialize()

    assert.property(serialized, 'birthDate')
    assert.property(serialized, 'createdAt')
    assert.property(serialized, 'updatedAt')
    assert.isString(serialized.birthDate)
    assert.isString(serialized.createdAt)
    assert.isString(serialized.updatedAt)
  })

  test('should have many rooms', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const room1 = await Room.create({
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    })

    const room2 = await Room.create({
      roomNumber: 'A102',
      capacity: 25,
      isAvailable: true,
      teacherId: teacher.id
    })

    await teacher.load('rooms')

    assert.equal(teacher.rooms.length, 2)
    assert.equal(teacher.rooms[0].roomNumber, room1.roomNumber)
    assert.equal(teacher.rooms[1].roomNumber, room2.roomNumber)
  })

  test('should update teacher information', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const originalUpdatedAt = teacher.updatedAt

    teacher.name = 'Professor Silva Santos'
    teacher.email = 'professor.santos@email.com'
    await teacher.save()

    assert.equal(teacher.name, 'Professor Silva Santos')
    assert.equal(teacher.email, 'professor.santos@email.com')
    assert.isTrue(teacher.updatedAt > originalUpdatedAt)
  })

  test('should validate email format', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    assert.isString(teacher.email)
    assert.isTrue(teacher.email.includes('@'))
    assert.isTrue(teacher.email.includes('.'))
  })

  test('should validate registration uniqueness', async ({ assert }) => {
    const teacher1 = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    assert.equal(teacher1.registration, 'PROF001')
    assert.exists(teacher1.id)
  })

  test('should handle birth date as DateTime', async ({ assert }) => {
    const birthDate = DateTime.fromISO('1980-01-15')
    
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: birthDate
    })

    assert.isTrue(teacher.birthDate instanceof DateTime)
    assert.equal(teacher.birthDate.toISODate(), '1980-01-15')
    assert.equal(teacher.birthDate.year, 1980)
    assert.equal(teacher.birthDate.month, 1)
    assert.equal(teacher.birthDate.day, 15)
  })
})