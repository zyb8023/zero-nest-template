import { Repository, FindManyOptions } from 'typeorm';
import { PaginationDto, PaginationResult } from '../dto/pagination.dto';

/**
 * 分页工具类
 * 
 * 为什么需要分页工具？
 * 1. 统一分页逻辑，避免重复代码
 * 2. 提供标准化的分页查询方法
 * 3. 便于维护和扩展
 */
export class PaginationUtil {
  /**
   * 分页查询
   * @param repository TypeORM Repository
   * @param paginationDto 分页参数
   * @param options 查询选项
   */
  static async paginate<T>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    options?: FindManyOptions<T>,
  ): Promise<PaginationResult<T>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await repository.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    return new PaginationResult(items, total, page, limit);
  }
}

