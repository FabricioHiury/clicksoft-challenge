import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Room from 'App/Models/Room'
import Teacher from 'App/Models/Teacher'
import Student from 'App/Models/Student'
import { DateTime } from 'luxon'

test.group('Room Model', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a room with valid data', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const roomData = {
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    }

    const room = await Room.create(roomData)

    assert.exists(room.id)
    assert.equal(room.roomNumber, roomData.roomNumber)
    assert.equal(room.capacity, roomData.capacity)
    assert.equal(room.isAvailable, roomData.isAvailable)
    assert.equal(room.teacherId, roomData.teacherId)
  })

  test('should have timestamps', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const room = await Room.create({
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    })

    assert.exists(room.createdAt)
    assert.exists(room.updatedAt)
    assert.isTrue(room.createdAt instanceof DateTime)
    assert.isTrue(room.updatedAt instanceof DateTime)
  })

  test('should serialize column names correctly', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const room = await Room.create({
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    })

    const serialized = room.serialize()

    assert.property(serialized, 'roomNumber')
    assert.property(serialized, 'isAvailable')
    assert.property(serialized, 'teacherId')
    assert.equal(serialized.roomNumber, 'A101')
    assert.equal(serialized.isAvailable, true)
    assert.equal(serialized.teacherId, teacher.id)
  })

  test('should belong to a teacher', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const room = await Room.create({
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    })

    await room.load('teacher')

    assert.exists(room.teacher)
    assert.equal(room.teacher.id, teacher.id)
    assert.equal(room.teacher.name, teacher.name)
  })

  test('should have many students through pivot table', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const room = await Room.create({
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    })

    const student1 = await Student.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    })

    const student2 = await Student.create({
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      registration: 'STU002',
      birthDate: DateTime.fromISO('1996-03-20')
    })

    await room.related('students').attach([student1.id, student2.id])
    await room.load('students')

    assert.equal(room.students.length, 2)
    assert.equal(room.students[0].name, student1.name)
    assert.equal(room.students[1].name, student2.name)
  })

  test('should update room availability', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const room = await Room.create({
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    })

    room.isAvailable = false
    await room.save()

    assert.equal(room.isAvailable, false)
    assert.isTrue(room.updatedAt > room.createdAt)
  })

  test('should validate capacity as number', async ({ assert }) => {
    const teacher = await Teacher.create({
      name: 'Professor Silva',
      email: 'professor.silva@email.com',
      registration: 'PROF001',
      birthDate: DateTime.fromISO('1980-01-15')
    })

    const room = await Room.create({
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true,
      teacherId: teacher.id
    })

    assert.isNumber(room.capacity)
    assert.equal(room.capacity, 30)
  })
})