import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

/**
 * 统一API响应DTO
 */
export class ApiResponseDto<T = any> {
  @ApiProperty({ example: true, description: '是否成功' })
  success!: boolean;

  @ApiProperty({ example: 1000, description: '业务状态码' })
  code!: number;

  @ApiProperty({ example: '操作成功', description: '消息' })
  message!: string;

  @ApiProperty({ description: '数据' })
  data!: T;

  @ApiProperty({ example: 1640000000000, description: '时间戳' })
  timestamp!: number;

  @ApiProperty({ example: '/api/v1/users', description: '请求路径' })
  path!: string;

  @ApiProperty({ example: 'a1b2c3d4', description: '请求ID', required: false })
  requestId?: string;
}

/**
 * API响应装饰器
 *
 * 使用示例:
 * ```ts
 * @ApiResponse(User, '获取用户列表')
 * @Get()
 * findAll() {
 *   return [];
 * }
 * ```
 */
export const ApiResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
  return applyDecorators(
    ApiOkResponse({
      description,
      type: ApiResponseDto,
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          code: { type: 'number', example: 1000 },
          message: { type: 'string', example: '操作成功' },
          data: { $ref: `#/components/schemas/${model.name}` },
          timestamp: { type: 'number', example: 1640000000000 },
          path: { type: 'string', example: '/api/v1/users' },
        },
      },
    }),
  );
};

/**
 * 分页响应装饰器
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description?: string,
) => {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          code: { type: 'number', example: 1000 },
          message: { type: 'string', example: '操作成功' },
          data: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: `#/components/schemas/${model.name}` },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number', example: 1 },
                  pageSize: { type: 'number', example: 10 },
                  total: { type: 'number', example: 100 },
                  totalPages: { type: 'number', example: 10 },
                },
              },
            },
          },
          timestamp: { type: 'number', example: 1640000000000 },
          path: { type: 'string', example: '/api/v1/users' },
        },
      },
    }),
  );
};
