/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  /**
   * Handle exception occurred during the HTTP lifecycle
   */
  public async handle(error: any, ctx: HttpContextContract) {
    const { request, response } = ctx

    // Log estruturado do erro
    Logger.error('Exception occurred', {
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        status: error.status
      },
      request: {
        method: request.method(),
        url: request.url(),
        ip: request.ip(),
        userAgent: request.header('user-agent')
      },
      timestamp: new Date().toISOString()
    })

    // Tratamento específico por tipo de erro
    switch (error.code) {
      case 'E_VALIDATION_FAILURE':
        return this.handleValidationError(error, response)
      
      case 'E_ROW_NOT_FOUND':
        return this.handleNotFoundError(error, response)
      
      case 'E_ROUTE_NOT_FOUND':
        return this.handleRouteNotFound(response)
      
      case 'E_UNAUTHORIZED_ACCESS':
        return this.handleUnauthorizedError(response)
      
      default:
        return this.handleGenericError(error, response)
    }
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(error: any, response: any) {
    return response.status(422).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Dados inválidos fornecidos',
        details: error.messages || []
      },
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Handle not found errors
   */
  private handleNotFoundError(error: any, response: any) {
    return response.status(404).json({
      success: false,
      error: {
        type: 'NOT_FOUND',
        message: 'Recurso não encontrado',
        details: error.message
      },
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Handle route not found
   */
  private handleRouteNotFound(response: any) {
    return response.status(404).json({
      success: false,
      error: {
        type: 'ROUTE_NOT_FOUND',
        message: 'Endpoint não encontrado',
        details: 'A rota solicitada não existe'
      },
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorizedError(response: any) {
    return response.status(401).json({
      success: false,
      error: {
        type: 'UNAUTHORIZED',
        message: 'Acesso não autorizado',
        details: 'Credenciais inválidas ou ausentes'
      },
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Handle generic errors
   */
  private handleGenericError(error: any, response: any) {
    const status = error.status || 500
    const isProduction = process.env.NODE_ENV === 'production'

    return response.status(status).json({
      success: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: status === 500 ? 'Erro interno do servidor' : error.message,
        details: isProduction ? 'Entre em contato com o suporte' : error.stack
      },
      timestamp: new Date().toISOString()
    })
  }

  public async report(error: any, ctx: HttpContextContract) {
    if (error.status === 500 || !error.status) {
      Logger.fatal('Critical error occurred', {
        error: {
          message: error.message,
          stack: error.stack
        },
        context: {
          url: ctx.request.url(),
          method: ctx.request.method(),
          ip: ctx.request.ip()
        }
      })
    }

    return super.report(error, ctx)
  }
}
