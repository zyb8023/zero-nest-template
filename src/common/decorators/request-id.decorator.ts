import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 请求ID装饰器
 *
 * 使用示例:
 * ```ts
 * @Get()
 * findAll(@RequestId() requestId: string) {
 *   console.log('Request ID:', requestId);
 * }
 * ```
 */
export const RequestId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return request.id;
});
