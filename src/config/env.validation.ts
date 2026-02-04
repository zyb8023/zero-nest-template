import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateIf, validateSync, Min, Max } from 'class-validator';

/**
 * 环境变量枚举
 */
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * 环境变量验证类
 *
 * 为什么需要环境变量验证？
 * 1. 启动时检查必需的环境变量是否存在
 * 2. 验证环境变量格式是否正确
 * 3. 避免运行时错误
 * 4. 企业级应用必须验证配置
 */
class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  DB_HOST!: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT!: number;

  @IsString()
  DB_USERNAME!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  DB_DATABASE!: string;

  @IsString()
  @ValidateIf((o) => o.REDIS_HOST)
  REDIS_HOST?: string;

  @IsNumber()
  @ValidateIf((o) => o.REDIS_PORT)
  @Min(1)
  @Max(65535)
  REDIS_PORT?: number;

  @IsString()
  @ValidateIf((o) => o.REDIS_PASSWORD)
  REDIS_PASSWORD?: string;
}

/**
 * 验证环境变量
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `环境变量验证失败:\n${errors
        .map((e) => Object.values(e.constraints || {}).join(', '))
        .join('\n')}`,
    );
  }

  return validatedConfig;
}
