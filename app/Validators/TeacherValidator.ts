import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TeacherValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(2),
      rules.maxLength(100)
    ]),
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.unique({ table: 'teachers', column: 'email' })
    ]),
    registration: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ table: 'teachers', column: 'registration' }),
      rules.minLength(5),
      rules.maxLength(20)
    ]),
    birthDate: schema.date({}, [
      rules.required(),
      rules.before('today')
    ])
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'name.minLength': 'O nome deve ter pelo menos 2 caracteres',
    'name.maxLength': 'O nome deve ter no máximo 100 caracteres',
    'email.required': 'O email é obrigatório',
    'email.email': 'O email deve ter um formato válido',
    'email.unique': 'Este email já está sendo usado por outro professor',
    'registration.required': 'A matrícula é obrigatória',
    'registration.unique': 'Esta matrícula já está sendo usada por outro professor',
    'registration.minLength': 'A matrícula deve ter pelo menos 5 caracteres',
    'registration.maxLength': 'A matrícula deve ter no máximo 20 caracteres',
    'birthDate.required': 'A data de nascimento é obrigatória',
    'birthDate.before': 'A data de nascimento deve ser anterior à data atual'
  }
}

export class TeacherUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(2),
      rules.maxLength(100)
    ]),
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.unique({ 
        table: 'teachers', 
        column: 'email',
        whereNot: { id: this.ctx.params.id }
      })
    ]),
    registration: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ 
        table: 'teachers', 
        column: 'registration',
        whereNot: { id: this.ctx.params.id }
      }),
      rules.minLength(5),
      rules.maxLength(20)
    ]),
    birthDate: schema.date({}, [
      rules.required(),
      rules.before('today')
    ])
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'name.minLength': 'O nome deve ter pelo menos 2 caracteres',
    'name.maxLength': 'O nome deve ter no máximo 100 caracteres',
    'email.required': 'O email é obrigatório',
    'email.email': 'O email deve ter um formato válido',
    'email.unique': 'Este email já está sendo usado por outro professor',
    'registration.required': 'A matrícula é obrigatória',
    'registration.unique': 'Esta matrícula já está sendo usada por outro professor',
    'registration.minLength': 'A matrícula deve ter pelo menos 5 caracteres',
    'registration.maxLength': 'A matrícula deve ter no máximo 20 caracteres',
    'birthDate.required': 'A data de nascimento é obrigatória',
    'birthDate.before': 'A data de nascimento deve ser anterior à data atual'
  }
}
