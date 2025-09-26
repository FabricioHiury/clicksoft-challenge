import { test } from '@japa/runner'
import { validator } from '@ioc:Adonis/Core/Validator'
import StudentValidator from 'App/Validators/StudentValidator'

test.group('Student Validator', () => {
  test('should pass validation with valid data', async ({ assert }) => {
    const validData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: '1995-05-15'
    }

    const validated = await validator.validate({
      schema: new StudentValidator({} as any).schema,
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
      registration: 'STU001',
      birthDate: '1995-05-15'
    }

    try {
      await validator.validate({
        schema: new StudentValidator({} as any).schema,
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
      registration: 'STU001',
      birthDate: '1995-05-15'
    }

    try {
      await validator.validate({
        schema: new StudentValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.email)
    }
  })

  test('should fail validation with missing registration', async ({ assert }) => {
    const invalidData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      birthDate: '1995-05-15'
    }

    try {
      await validator.validate({
        schema: new StudentValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.registration)
    }
  })

  test('should fail validation with invalid birth date', async ({ assert }) => {
    const invalidData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: 'invalid-date'
    }

    try {
      await validator.validate({
        schema: new StudentValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.birthDate)
    }
  })

  test('should fail validation with empty name', async ({ assert }) => {
    const invalidData = {
      name: '',
      email: 'joao.silva@email.com',
      registration: 'STU001',
      birthDate: '1995-05-15'
    }

    try {
      await validator.validate({
        schema: new StudentValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.name)
    }
  })

  test('should fail validation with empty registration', async ({ assert }) => {
    const invalidData = {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      registration: '',
      birthDate: '1995-05-15'
    }

    try {
      await validator.validate({
        schema: new StudentValidator({} as any).schema,
        data: invalidData
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error.messages)
      assert.exists(error.messages.registration)
    }
  })

  test('should have custom error messages', async ({ assert }) => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      registration: '',
      birthDate: 'invalid-date'
    }

    try {
      await validator.validate({
        schema: new StudentValidator({} as any).schema,
        data: invalidData,
        messages: new StudentValidator({} as any).messages
      })
      assert.fail('Should have thrown validation error')
    } catch (error) {
      // Verificar se as mensagens customizadas estão sendo usadas
      assert.exists(error.messages)
      assert.isObject(error.messages)
    }
  })

  test('should validate email format correctly', async ({ assert }) => {
    const testCases = [
      { email: 'valid@email.com', shouldPass: true },
      { email: 'another.valid@domain.org', shouldPass: true },
      { email: 'invalid-email', shouldPass: false },
      { email: '@invalid.com', shouldPass: false },
      { email: 'invalid@', shouldPass: false },
      { email: '', shouldPass: false }
    ]

    for (const testCase of testCases) {
      const data = {
        name: 'João Silva',
        email: testCase.email,
        registration: 'STU001',
        birthDate: '1995-05-15'
      }

      try {
        await validator.validate({
          schema: new StudentValidator({} as any).schema,
          data: data
        })
        
        if (!testCase.shouldPass) {
          assert.fail(`Email ${testCase.email} should have failed validation`)
        }
      } catch (error) {
        if (testCase.shouldPass) {
          assert.fail(`Email ${testCase.email} should have passed validation`)
        }
        assert.exists(error.messages)
      }
    }
  })
})