import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import swaggerUi from 'swagger-ui-express'
import swaggerSpecs from '../../config/swagger'

export default class SwaggerMiddleware {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const url = request.url()
    
    if (url === '/api-docs') {
      const html = swaggerUi.generateHTML(swaggerSpecs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'API de Alocação de Salas - Documentação'
      })
      response.type('text/html')
      return response.send(html)
    }
    
    if (url === '/api-docs.json') {
      return response.json(swaggerSpecs)
    }
    
    await next()
  }
}