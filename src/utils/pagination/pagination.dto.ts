import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 分页查询 DTO
 * 
 * 为什么需要分页？
 * 1. 避免一次性加载大量数据，提高性能
 * 2. 减少网络传输，提升用户体验
 * 3. 企业级应用必须支持大数据量查询
 */
export class PaginationDto {
  /**
   * 页码（从 1 开始）
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码不能小于 1' })
  page?: number = 1;

  /**
   * 每页数量
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量不能小于 1' })
  @Max(100, { message: '每页数量不能超过 100' })
  limit?: number = 10;
}

/**
 * 分页响应结果
 */
export class PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}

