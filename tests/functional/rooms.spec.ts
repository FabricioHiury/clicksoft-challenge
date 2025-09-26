import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { RoomFactory, TeacherFactory, StudentFactory } from 'Database/factories'

test.group('Rooms Controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should list available rooms with pagination', async ({ client, assert }) => {
    const teacher = await TeacherFactory.create()
    await RoomFactory.merge({ 
      teacherId: teacher.id,
      isAvailable: true 
    }).createMany(15)

    const response = await client.get('/api/rooms/available?page=1&limit=10')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Available rooms retrieved successfully'
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 10)
    assert.exists(response.body().meta)
    assert.equal(response.body().meta.currentPage, 1)
    assert.equal(response.body().meta.perPage, 10)
  })

  test('should list all rooms with pagination', async ({ client, assert }) => {
    const teacher = await TeacherFactory.create()
    await RoomFactory.merge({ teacherId: teacher.id }).createMany(12)

    const response = await client.get('/api/rooms?page=1&limit=10')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'All rooms retrieved successfully'
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 10)
    assert.exists(response.body().meta)
    assert.equal(response.body().meta.currentPage, 1)
    assert.equal(response.body().meta.perPage, 10)
  })

  test('should include teacher information in room listing', async ({ client, assert }) => {
    const teacher = await TeacherFactory.create()
    await RoomFactory.merge({ 
      teacherId: teacher.id,
      isAvailable: true 
    }).create()

    const response = await client.get('/api/rooms/available')

    response.assertStatus(200)
    
    const room = response.body().data[0]
    assert.exists(room.teacher)
    assert.equal(room.teacher.id, teacher.id)
    assert.exists(room.teacher.name)
    assert.exists(room.teacher.email)
  })

  test('should include students information in all rooms listing', async ({ client, assert }) => {
    const teacher = await TeacherFactory.create()
    const room = await RoomFactory.merge({ teacherId: teacher.id }).create()
    const students = await StudentFactory.createMany(2)
    
    // Alocar estudantes na sala
    await room.related('students').attach(students.map(s => s.id))

    const response = await client.get('/api/rooms')

    response.assertStatus(200)
    
    const roomData = response.body().data[0]
    assert.exists(roomData.students)
    assert.isArray(roomData.students)
    assert.lengthOf(roomData.students, 2)
  })

  test('should handle empty available rooms list', async ({ client, assert }) => {
    // Criar apenas salas indisponíveis
    const teacher = await TeacherFactory.create()
    await RoomFactory.merge({ 
      teacherId: teacher.id,
      isAvailable: false 
    }).createMany(3)

    const response = await client.get('/api/rooms/available')

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Available rooms retrieved successfully'
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 0)
  })

  test('should respect pagination limits', async ({ client, assert }) => {
    const teacher = await TeacherFactory.create()
    await RoomFactory.merge({ 
      teacherId: teacher.id,
      isAvailable: true 
    }).createMany(25)

    // Testar limite padrão
    const response1 = await client.get('/api/rooms/available')
    assert.lengthOf(response1.body().data, 10) // limite padrão

    // Testar limite customizado
    const response2 = await client.get('/api/rooms/available?limit=15')
    assert.lengthOf(response2.body().data, 15)

    // Testar limite máximo
    const response3 = await client.get('/api/rooms/available?limit=100')
    assert.lengthOf(response3.body().data, 25) // não deve exceder o total
  })

  test('should order rooms by room number', async ({ client, assert }) => {
    const teacher = await TeacherFactory.create()
    // Criar salas com números específicos
    await RoomFactory.merge({ 
      teacherId: teacher.id,
      roomNumber: '301',
      isAvailable: true 
    }).create()
    await RoomFactory.merge({ 
      teacherId: teacher.id,
      roomNumber: '101',
      isAvailable: true 
    }).create()
    await RoomFactory.merge({ 
      teacherId: teacher.id,
      roomNumber: '201',
      isAvailable: true 
    }).create()

    const response = await client.get('/api/rooms/available')

    response.assertStatus(200)
    
    const rooms = response.body().data
    assert.equal(rooms[0].room_number, '101')
    assert.equal(rooms[1].room_number, '201')
    assert.equal(rooms[2].room_number, '301')
  })

  test('should handle server errors gracefully', async ({ client }) => {
    // Este teste simula um erro interno do servidor
    // Em um cenário real, você poderia mockar o banco de dados para falhar
    
    const response = await client.get('/api/rooms/available')
    
    // Se não houver erro, deve retornar sucesso
    if (response.status() === 200) {
      response.assertBodyContains({
        success: true
      })
    } else {
      // Se houver erro, deve ter estrutura padronizada
      response.assertBodyContains({
        success: false,
        timestamp: response.body().timestamp
      })
    }
  })
})