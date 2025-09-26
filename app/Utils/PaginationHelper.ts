import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export interface PaginationOptions {
  page?: number
  limit?: number
  maxLimit?: number
  defaultLimit?: number
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export class PaginationHelper {
  public static getParams(ctx: HttpContextContract, options: PaginationOptions = {}): { page: number, limit: number } {
    const { request } = ctx
    const {
      maxLimit = 100,
      defaultLimit = 10
    } = options

    let page = parseInt(request.input('page', '1'))
    let limit = parseInt(request.input('limit', defaultLimit.toString()))

    page = Math.max(1, page)
    limit = Math.min(Math.max(1, limit), maxLimit)

    return { page, limit }
  }

  public static async paginate<T extends LucidModel>(
    query: ModelQueryBuilderContract<T>,
    ctx: HttpContextContract,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = this.getParams(ctx, options)
    const { request } = ctx

    const result = await query.paginate(page, limit)

    const baseUrl = `${request.protocol()}://${request.header('host')}${request.url().split('?')[0]}`
    const buildUrl = (pageNum: number) => `${baseUrl}?page=${pageNum}&limit=${limit}`

    const meta: PaginationMeta = {
      total: result.total,
      perPage: result.perPage,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      firstPage: 1,
      nextPageUrl: result.currentPage < result.lastPage ? buildUrl(result.currentPage + 1) : null,
      previousPageUrl: result.currentPage > 1 ? buildUrl(result.currentPage - 1) : null
    }

    return {
      data: result.all(),
      meta
    }
  }

  public static createResponse<T>(
    data: T[],
    meta: PaginationMeta,
    message: string = 'Dados recuperados com sucesso'
  ) {
    return {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString()
    }
  }
}