import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Student from 'App/Models/Student'
import { DateTime } from 'luxon'

test.group('Student Model', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a student with valid data', async ({ assert }) => {
    const studentData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    }

    const student = await Student.create(studentData)

    assert.exists(student.id)
    assert.equal(student.name, studentData.name)
    assert.equal(student.email, studentData.email)
    assert.equal(student.registration, studentData.registration)
    assert.equal(student.birthDate.toISODate(), '1995-05-15')
  })

  test('should have timestamps', async ({ assert }) => {
    const student = await Student.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    })

    assert.exists(student.createdAt)
    assert.exists(student.updatedAt)
    assert.isTrue(student.createdAt instanceof DateTime)
    assert.isTrue(student.updatedAt instanceof DateTime)
  })

  test('should serialize dates correctly', async ({ assert }) => {
    const student = await Student.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    })

    const serialized = student.serialize()

    assert.isString(serialized.birthDate)
    assert.isString(serialized.createdAt)
    assert.isString(serialized.updatedAt)
  })

  test('should have many-to-many relationship with rooms', async ({ assert }) => {
    const student = await Student.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    })

    // Verificar se o relacionamento existe
    const roomsQuery = student.related('rooms')
    assert.exists(roomsQuery)
  })

  test('should find student by email', async ({ assert }) => {
    const email = 'joao.silva@email.com'
    
    await Student.create({
      name: 'João Silva',
      email: email,
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    })

    const foundStudent = await Student.findBy('email', email)
    
    assert.exists(foundStudent)
    assert.equal(foundStudent!.email, email)
  })

  test('should find student by registration', async ({ assert }) => {
    const registration = 'STU001'
    
    await Student.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: registration,
      birthDate: DateTime.fromISO('1995-05-15')
    })

    const foundStudent = await Student.findBy('registration', registration)
    
    assert.exists(foundStudent)
    assert.equal(foundStudent!.registration, registration)
  })

  test('should update student data', async ({ assert }) => {
    const student = await Student.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    })

    const newName = 'João Santos'
    student.name = newName
    await student.save()

    const updatedStudent = await Student.find(student.id)
    assert.equal(updatedStudent!.name, newName)
  })

  test('should delete student', async ({ assert }) => {
    const student = await Student.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: DateTime.fromISO('1995-05-15')
    })

    const studentId = student.id
    await student.delete()

    const deletedStudent = await Student.find(studentId)
    assert.isNull(deletedStudent)
  })

  test('should query students with pagination', async ({ assert }) => {
    // Criar múltiplos estudantes
    for (let i = 1; i <= 15; i++) {
      await Student.create({
        name: `Student ${i}`,
        email: `student${i}@email.com`,
        registration: `STU${i.toString().padStart(3, '0')}`,
        birthDate: DateTime.fromISO('1995-05-15')
      })
    }

    const page1 = await Student.query().paginate(1, 10)
    
    assert.equal(page1.currentPage, 1)
    assert.equal(page1.perPage, 10)
    assert.lengthOf(page1.all(), 10)
    assert.isTrue(page1.total >= 15)
  })
})