import { SetMetadata } from '@nestjs/common';

export const API_VERSION_KEY = 'apiVersion';

/**
 * API 版本装饰器
 *
 * 使用示例:
 * ```ts
 * @ApiVersion('1', '2')
 * @Get()
 * findAll() {
 *   return [];
 * }
 * ```
 */
export const ApiVersion = (...versions: string[]) => SetMetadata(API_VERSION_KEY, versions);
