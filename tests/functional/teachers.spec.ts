import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { TeacherFactory } from 'Database/factories'

test.group('Teachers Controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should create a new teacher successfully', async ({ client, assert }) => {
    const teacherData = {
      name: 'Prof. Maria Santos',
      email: 'maria.santos@email.com',
      registration: 'PROF001',
      birthDate: '1980-03-20'
    }

    const response = await client.post('/api/teachers').json(teacherData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Teacher created successfully'
    })

    assert.exists(response.body().data.id)
    assert.equal(response.body().data.name, teacherData.name)
    assert.equal(response.body().data.email, teacherData.email)
    assert.equal(response.body().data.registration, teacherData.registration)
  })

  test('should list teachers with pagination', async ({ client, assert }) => {
    await TeacherFactory.createMany(15)

    const response = await client.get('/api/teachers?page=1&limit=10')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Teachers retrieved successfully'
    })

    assert.isArray(response.body().data.data)
    assert.lengthOf(response.body().data.data, 10)
    assert.exists(response.body().data.meta)
  })

  test('should create room for teacher', async ({ client, assert }) => {
    // Limpar dados existentes
    await Database.rawQuery('DELETE FROM student_rooms')
    await Database.rawQuery('DELETE FROM rooms')
    await Database.rawQuery('DELETE FROM teachers')
    
    const teacher = await TeacherFactory.create()

    const roomData = {
      roomNumber: '101',
      capacity: 30,
      isAvailable: true
    }

    const response = await client
      .post(`/api/teachers/${teacher.id}/rooms`)
      .json(roomData)

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Room created successfully'
    })

    assert.exists(response.body().data.id)
    assert.equal(response.body().data.room_number, roomData.roomNumber)
    assert.equal(response.body().data.capacity, roomData.capacity)
  })

  test('should get teacher details', async ({ client, assert }) => {
    const teacher = await TeacherFactory.create()

    const response = await client.get(`/api/teachers/${teacher.id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Teacher details retrieved successfully'
    })

    assert.exists(response.body().data)
  })

  test('should return 404 for non-existent teacher', async ({ client }) => {
    const response = await client.get('/api/teachers/999')

    response.assertStatus(404)
    response.assertBodyContains({
      success: false,
      message: 'Teacher not found'
    })
  })

  test('should validate teacher creation data', async ({ client }) => {
    const response = await client.post('/api/teachers').json({
      name: '',
      email: 'invalid-email'
    })

    response.assertStatus(422)
    response.assertBodyContains({
      success: false
    })
  })
})