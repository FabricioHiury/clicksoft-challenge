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

    const result = await query.paginate(page, limit)

    const meta: PaginationMeta = {
      total: result.total,
      perPage: result.perPage,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      firstPage: 1,
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