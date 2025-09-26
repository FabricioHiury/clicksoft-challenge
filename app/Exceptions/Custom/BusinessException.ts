import { Exception } from '@adonisjs/core/build/standalone'

export class BusinessException extends Exception {
  constructor(message: string, status: number = 400, code?: string) {
    super(message, status, code)
  }
}