import { test } from '@japa/runner'
import { validator } from '@ioc:Adonis/Core/Validator'
import RoomValidator, { StudentAllocationValidator } from 'App/Validators/RoomValidator'

test.group('Room Validator', () => {
  test('should pass validation with valid data', async ({ assert }) => {
    const validData = {
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: true
    }

    const validated = await validator.validate({
      schema: new RoomValidator({} as any).schema,
      data: validData
    })

    assert.equal(validated.roomNumber, validData.roomNumber)
    assert.equal(validated.capacity, validData.capacity)
    assert.equal(validated.isAvailable, validData.isAvailable)
  })

  test('should pass validation without isAvailable (optional field)', async ({ assert }) => {
    const validData = {
      roomNumber: 'A102',
      capacity: 25
    }

    const validated = await validator.validate({
      schema: new RoomValidator({} as any).schema,
      data: validData
    })

    assert.equal(validated.roomNumber, validData.roomNumber)
    assert.equal(validated.capacity, validData.capacity)
    assert.isUndefined(validated.isAvailable)
  })

  test('should fail validation with missing roomNumber', async ({ assert }) => {
    const invalidData = {
      capacity: 30,
      isAvailable: true
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.roomNumber)
    }
  })

  test('should fail validation with missing capacity', async ({ assert }) => {
    const invalidData = {
      roomNumber: 'A101',
      isAvailable: true
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.capacity)
    }
  })

  test('should fail validation with empty roomNumber', async ({ assert }) => {
    const invalidData = {
      roomNumber: '',
      capacity: 30,
      isAvailable: true
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.roomNumber)
    }
  })

  test('should fail validation with roomNumber too long', async ({ assert }) => {
    const invalidData = {
      roomNumber: 'A1234567890', // 11 characters, max is 10
      capacity: 30,
      isAvailable: true
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.roomNumber)
    }
  })

  test('should fail validation with capacity below minimum', async ({ assert }) => {
    const invalidData = {
      roomNumber: 'A101',
      capacity: 0, // Below minimum of 1
      isAvailable: true
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.capacity)
    }
  })

  test('should fail validation with capacity above maximum', async ({ assert }) => {
    const invalidData = {
      roomNumber: 'A101',
      capacity: 101, // Above maximum of 100
      isAvailable: true
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.capacity)
    }
  })

  test('should fail validation with non-numeric capacity', async ({ assert }) => {
    const invalidData = {
      roomNumber: 'A101',
      capacity: 'thirty', // Should be number
      isAvailable: true
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.capacity)
    }
  })

  test('should fail validation with non-boolean isAvailable', async ({ assert }) => {
    const invalidData = {
      roomNumber: 'A101',
      capacity: 30,
      isAvailable: 'yes' // Should be boolean
    }

    try {
      await validator.validate({
        schema: new RoomValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.isAvailable)
    }
  })
})

test.group('Student Allocation Validator', () => {
  test('should pass validation with valid studentId', async ({ assert }) => {
    const validData = {
      studentId: 1
    }

    const validated = await validator.validate({
      schema: new StudentAllocationValidator({} as any).schema,
      data: validData
    })

    assert.equal(validated.studentId, validData.studentId)
  })

  test('should fail validation with missing studentId', async ({ assert }) => {
    const invalidData = {}

    try {
      await validator.validate({
        schema: new StudentAllocationValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.studentId)
    }
  })

  test('should fail validation with non-numeric studentId', async ({ assert }) => {
    const invalidData = {
      studentId: 'one'
    }

    try {
      await validator.validate({
        schema: new StudentAllocationValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.studentId)
    }
  })

  test('should fail validation with negative studentId', async ({ assert }) => {
    const invalidData = {
      studentId: -1
    }

    try {
      await validator.validate({
        schema: new StudentAllocationValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.studentId)
    }
  })
})