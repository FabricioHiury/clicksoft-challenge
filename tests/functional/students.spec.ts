import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { StudentFactory } from 'Database/factories'

test.group('Students Controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a new student', async ({ client, assert }) => {
    const studentData = {
      name: 'João Silva',
      email: 'joao.test@email.com',
      registration: 'STU100',
      birthDate: '1995-05-15'
    }

    const response = await client.post('/api/students').json(studentData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Student created successfully'
    })

    assert.exists(response.body().data)
    assert.equal(response.body().data.name, studentData.name)
    assert.equal(response.body().data.email, studentData.email)
    assert.equal(response.body().data.registration, studentData.registration)
  })

  test('should not create student with invalid email', async ({ client }) => {
    const studentData = {
      name: 'João Silva',
      email: 'invalid-email',
      registration: 'STU001',
      birthDate: '1995-05-15'
    }

    const response = await client.post('/api/students').json(studentData)

    response.assertStatus(422)
    response.assertBodyContains({
      success: false
    })
  })

  test('should not create student with duplicate registration', async ({ client }) => {
    // Criar primeiro aluno com matrícula específica
    await StudentFactory.merge({ registration: 'STU002' }).create()

    const studentData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU002',
      birthDate: '1995-05-15'
    }

    const response = await client.post('/api/students').json(studentData)

    response.assertStatus(422)
  })

  test('should list students with pagination', async ({ client, assert }) => {
    // Criar alguns alunos para teste
    await StudentFactory.createMany(15)

    const response = await client.get('/api/students?page=1&limit=10')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Students retrieved successfully'
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 10)
    assert.exists(response.body().meta)
    assert.equal(response.body().meta.currentPage, 1)
    assert.equal(response.body().meta.perPage, 10)
  })

  test('should get student rooms', async ({ client, assert }) => {
    const student = await StudentFactory.create()

    const response = await client.get(`/api/students/${student.id}/rooms`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Student rooms retrieved successfully'
    })

    assert.exists(response.body().data.student)
    assert.isArray(response.body().data.rooms)
  })

  test('should return 404 for non-existent student rooms', async ({ client }) => {
    const response = await client.get('/api/students/999/rooms')

    response.assertStatus(404)
    response.assertBodyContains({
      success: false,
      message: 'Student not found'
    })
  })

  test('should validate required fields', async ({ client }) => {
    const response = await client.post('/api/students').json({})

    response.assertStatus(422)
    response.assertBodyContains({
      success: false
    })
  })

  test('should validate birth date format', async ({ client }) => {
    const studentData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: 'invalid-date'
    }

    const response = await client.post('/api/students').json(studentData)

    response.assertStatus(422)
  })
})