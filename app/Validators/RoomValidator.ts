import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoomValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    roomNumber: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ table: 'rooms', column: 'room_number' }),
      rules.minLength(1),
      rules.maxLength(10)
    ]),
    capacity: schema.number([
      rules.required(),
      rules.range(1, 100)
    ]),
    isAvailable: schema.boolean.optional()
  })

  public messages: CustomMessages = {
    'roomNumber.required': 'O número da sala é obrigatório',
    'roomNumber.unique': 'Este número de sala já está sendo usado',
    'roomNumber.minLength': 'O número da sala deve ter pelo menos 1 caractere',
    'roomNumber.maxLength': 'O número da sala deve ter no máximo 10 caracteres',
    'capacity.required': 'A capacidade da sala é obrigatória',
    'capacity.range': 'A capacidade da sala deve estar entre 1 e 100 alunos'
  }
}

export class StudentAllocationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    studentId: schema.number([
      rules.required(),
      rules.exists({ table: 'students', column: 'id' })
    ])
  })

  public messages: CustomMessages = {
    'studentId.required': 'O ID do aluno é obrigatório',
    'studentId.exists': 'O aluno especificado não existe'
  }
}
