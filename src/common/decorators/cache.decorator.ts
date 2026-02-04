import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cacheKey';
export const CACHE_TTL_METADATA = 'cacheTTL';

/**
 * 缓存键装饰器
 *
 * 使用示例:
 * ```ts
 * @CacheKey('users:list')
 * @Get()
 * findAll() {
 *   return [];
 * }
 * ```
 */
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);

/**
 * 缓存TTL装饰器
 *
 * 使用示例:
 * ```ts
 * @CacheTTL(60) // 缓存60秒
 * @Get(':id')
 * findOne(@Param('id') id: string) {
 *   return this.usersService.findOne(id);
 * }
 * ```
 */
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_METADATA, ttl);
