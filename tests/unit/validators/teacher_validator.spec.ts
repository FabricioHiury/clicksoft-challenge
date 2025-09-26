import { test } from '@japa/runner'
import { validator } from '@ioc:Adonis/Core/Validator'
import TeacherValidator, { TeacherUpdateValidator } from 'App/Validators/TeacherValidator'

test.group('TeacherValidator', () => {
  test('should pass validation with valid data', async ({ assert }) => {
    const validData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'PROF001',
      birthDate: '1980-05-15'
    }

    const validated = await validator.validate({
      schema: new TeacherValidator({} as any).schema,
      data: validData
    })

    assert.equal(validated.name, validData.name)
    assert.equal(validated.email, validData.email)
    assert.equal(validated.registration, validData.registration)
    assert.equal(validated.birthDate, validData.birthDate)
  })

  test('should fail validation with missing name', async ({ assert }) => {
    const invalidData = {
      email: 'joao.silva@email.com',
      registration: 'PROF001',
      birthDate: '1980-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.name)
    }
  })

  test('should fail validation with invalid email', async ({ assert }) => {
    const invalidData = {
      name: 'João Silva',
      email: 'invalid-email',
      registration: 'PROF001',
      birthDate: '1980-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.email)
    }
  })

  test('should fail validation with short name', async ({ assert }) => {
    const invalidData = {
      name: 'J',
      email: 'joao.silva@email.com',
      registration: 'PROF001',
      birthDate: '1980-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.name)
    }
  })

  test('should fail validation with long name', async ({ assert }) => {
    const invalidData = {
      name: 'J'.repeat(101),
      email: 'joao.silva@email.com',
      registration: 'PROF001',
      birthDate: '1980-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.name)
    }
  })

  test('should fail validation with short registration', async ({ assert }) => {
    const invalidData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'P01',
      birthDate: '1980-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.registration)
    }
  })

  test('should fail validation with long registration', async ({ assert }) => {
    const invalidData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'P'.repeat(21),
      birthDate: '1980-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.registration)
    }
  })

  test('should fail validation with future birth date', async ({ assert }) => {
    const invalidData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'PROF001',
      birthDate: '2030-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.birthDate)
    }
  })

  test('should fail validation with missing required fields', async ({ assert }) => {
    const invalidData = {}

    try {
      await validator.validate({
        schema: new TeacherValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.name)
      assert.exists(error.messages.email)
      assert.exists(error.messages.registration)
      assert.exists(error.messages.birthDate)
    }
  })
})

test.group('TeacherUpdateValidator', () => {
  test('should pass validation with valid data for update', async ({ assert }) => {
    const validData = {
      name: 'João Silva Updated',
      email: 'joao.updated@email.com',
      registration: 'PROF001',
      birthDate: '1980-05-15'
    }

    const validated = await validator.validate({
      schema: new TeacherUpdateValidator({ params: { id: 1 } } as any).schema,
      data: validData
    })

    assert.equal(validated.name, validData.name)
    assert.equal(validated.email, validData.email)
    assert.equal(validated.registration, validData.registration)
    assert.equal(validated.birthDate, validData.birthDate)
  })

  test('should fail validation with missing name in update', async ({ assert }) => {
    const invalidData = {
      email: 'joao.updated@email.com',
      registration: 'PROF001',
      birthDate: '1980-05-15'
    }

    try {
      await validator.validate({
        schema: new TeacherUpdateValidator({ params: { id: 1 } } as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.name)
    }
  })
})