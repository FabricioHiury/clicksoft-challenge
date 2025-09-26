import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(100)
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'students', column: 'email' })
    ]),
    registration: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(20),
      rules.unique({ table: 'students', column: 'registration' })
    ]),
    birthDate: schema.date({
      format: 'yyyy-MM-dd'
    }, [
      rules.before('today')
    ])
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'name.minLength': 'O nome deve ter pelo menos 2 caracteres',
    'name.maxLength': 'O nome deve ter no máximo 100 caracteres',
    'email.required': 'O email é obrigatório',
    'email.email': 'O email deve ter um formato válido',
    'email.unique': 'Este email já está cadastrado',
    'registration.required': 'A matrícula é obrigatória',
    'registration.minLength': 'A matrícula deve ter pelo menos 3 caracteres',
    'registration.maxLength': 'A matrícula deve ter no máximo 20 caracteres',
    'registration.unique': 'Esta matrícula já está cadastrada',
    'birthDate.required': 'A data de nascimento é obrigatória',
    'birthDate.date': 'A data de nascimento deve ser uma data válida',
    'birthDate.before': 'A data de nascimento deve ser anterior à data atual'
  }
}

export class StudentUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(100)
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ 
        table: 'students', 
        column: 'email',
        whereNot: { id: this.ctx.params.id }
      })
    ]),
    registration: schema.string({ trim: true }, [
      rules.minLength(3),
      rules.maxLength(20),
      rules.unique({ 
        table: 'students', 
        column: 'registration',
        whereNot: { id: this.ctx.params.id }
      })
    ]),
    birthDate: schema.date({
      format: 'yyyy-MM-dd'
    }, [
      rules.before('today')
    ])
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'name.minLength': 'O nome deve ter pelo menos 2 caracteres',
    'name.maxLength': 'O nome deve ter no máximo 100 caracteres',
    'email.required': 'O email é obrigatório',
    'email.email': 'O email deve ter um formato válido',
    'email.unique': 'Este email já está cadastrado por outro aluno',
    'registration.required': 'A matrícula é obrigatória',
    'registration.minLength': 'A matrícula deve ter pelo menos 3 caracteres',
    'registration.maxLength': 'A matrícula deve ter no máximo 20 caracteres',
    'registration.unique': 'Esta matrícula já está cadastrada por outro aluno',
    'birthDate.required': 'A data de nascimento é obrigatória',
    'birthDate.date': 'A data de nascimento deve ser uma data válida',
    'birthDate.before': 'A data de nascimento deve ser anterior à data atual'
  }
}
