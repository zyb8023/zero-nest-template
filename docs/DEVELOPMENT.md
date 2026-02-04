# 开发指南

## 🎯 框架定位

这是一个**通用的 NestJS 后端服务框架**，提供了完整的项目结构和核心功能集成，可以快速启动新的后端项目，避免重复配置。

## 📋 快速开始

### 第一步：安装依赖

```bash
npm install
```

**为什么需要安装依赖？**

- 安装所有必需的 npm 包
- 包括 NestJS、TypeORM、Redis、Log4js 等核心库
- 安装开发工具（TypeScript、ESLint、Prettier 等）

### 第二步：配置环境变量

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置你的数据库和 Redis：

```env
# MySQL 配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
```

**为什么需要环境变量？**

- 不同环境（开发/生产）使用不同配置
- 敏感信息（密码）不硬编码在代码中
- 便于配置管理和切换

### 第三步：启动服务

确保 MySQL 和 Redis 服务已启动，然后：

```bash
# 开发模式（热重载）
npm run start:dev
```

**为什么使用开发模式？**

- 代码修改后自动重启
- 便于开发和调试
- 详细的错误信息

### 第四步：验证服务

访问 `http://localhost:3000/api`，应该看到：

```
Carto Service API is running! 🚀
```

## 🏗️ 创建新模块

### 步骤 1：创建模块目录

```bash
mkdir -p src/modules/product
mkdir -p src/modules/product/dto
```

**为什么需要目录结构？**

- 组织代码，便于维护
- 遵循 NestJS 最佳实践
- 清晰的模块边界

### 步骤 2：创建实体（Entity）

创建 `src/modules/product/product.entity.ts`：

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 产品实体
 *
 * 为什么需要实体？
 * 1. 定义数据库表结构
 * 2. TypeORM 会根据实体自动创建表
 * 3. 提供类型安全的数据库操作
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**关键点说明：**

- `@Entity('products')`: 指定表名为 `products`
- `@PrimaryGeneratedColumn()`: 自增主键
- `@Column()`: 普通列，可以指定类型和长度
- `@CreateDateColumn()`: 自动设置创建时间
- `@UpdateDateColumn()`: 自动更新修改时间

### 步骤 3：创建 DTO

创建 `src/modules/product/dto/create-product.dto.ts`：

```typescript
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

/**
 * 创建产品 DTO
 *
 * 为什么需要 DTO？
 * 1. 定义 API 输入格式
 * 2. 自动验证数据
 * 3. 类型安全
 */
export class CreateProductDto {
  @IsNotEmpty({ message: '产品名称不能为空' })
  @IsString({ message: '产品名称必须是字符串' })
  name: string;

  @IsNotEmpty({ message: '价格不能为空' })
  @IsNumber({}, { message: '价格必须是数字' })
  @Min(0, { message: '价格不能小于 0' })
  price: number;
}
```

**验证装饰器说明：**

- `@IsNotEmpty()`: 不能为空
- `@IsString()`: 必须是字符串
- `@IsNumber()`: 必须是数字
- `@Min()`: 最小值验证

### 步骤 4：创建服务（Service）

创建 `src/modules/product/product.service.ts`：

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { LoggerService } from '../../common/logger/logger.service';

/**
 * 产品服务
 *
 * 为什么需要服务层？
 * 1. 包含业务逻辑
 * 2. 可以被多个控制器复用
 * 3. 便于单元测试
 */
@Injectable()
export class ProductService {
  constructor(
    // 注入 Repository，用于数据库操作
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    // 注入缓存管理器
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    // 注入日志服务
    private logger: LoggerService,
  ) {}

  /**
   * 创建产品
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(`创建产品: ${createProductDto.name}`);

    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    // 清除缓存
    await this.cacheManager.del('products:all');

    return savedProduct;
  }

  /**
   * 查询所有产品
   */
  async findAll(): Promise<Product[]> {
    // 尝试从缓存获取
    const cacheKey = 'products:all';
    const cached = await this.cacheManager.get<Product[]>(cacheKey);

    if (cached) {
      this.logger.debug('从缓存获取产品列表');
      return cached;
    }

    // 从数据库查询
    const products = await this.productRepository.find();

    // 存入缓存（1小时）
    await this.cacheManager.set(cacheKey, products, 3600);

    return products;
  }

  /**
   * 根据 ID 查询产品
   */
  async findOne(id: number): Promise<Product> {
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);

    if (cached) {
      return cached;
    }

    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`产品 ID ${id} 不存在`);
    }

    await this.cacheManager.set(cacheKey, product, 3600);
    return product;
  }
}
```

**关键点说明：**

- `@Injectable()`: 标记为可注入的服务
- `@InjectRepository()`: 注入 TypeORM Repository
- `@Inject(CACHE_MANAGER)`: 注入缓存管理器
- 缓存策略：先查缓存，再查数据库

### 步骤 5：创建控制器（Controller）

创建 `src/modules/product/product.controller.ts`：

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

/**
 * 产品控制器
 *
 * 为什么需要控制器？
 * 1. 处理 HTTP 请求
 * 2. 定义 API 路由
 * 3. 调用服务层处理业务
 */
@Controller('products') // 路由前缀：/api/products
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 创建产品
   * POST /api/products
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // 返回 201
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * 查询所有产品
   * GET /api/products
   */
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  /**
   * 查询单个产品
   * GET /api/products/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }
}
```

**关键点说明：**

- `@Controller('products')`: 定义路由前缀
- `@Get()`, `@Post()`: HTTP 方法装饰器
- `@Body()`: 获取请求体
- `@Param()`: 获取路径参数
- `ParseIntPipe`: 自动将参数转换为数字

### 步骤 6：创建模块（Module）

创建 `src/modules/product/product.module.ts`：

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';

/**
 * 产品模块
 *
 * 为什么需要模块？
 * 1. 组织相关功能
 * 2. 管理依赖注入
 * 3. 封装模块内部实现
 */
@Module({
  // 注册实体，使 ProductService 可以使用 Repository
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  // 如果其他模块需要使用 ProductService，在这里导出
  // exports: [ProductService],
})
export class ProductModule {}
```

**关键点说明：**

- `TypeOrmModule.forFeature([Product])`: 注册实体
- `controllers`: 控制器列表
- `providers`: 服务列表
- `exports`: 导出的服务（供其他模块使用）

### 步骤 7：注册模块

在 `src/app.module.ts` 中导入：

```typescript
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    // ... 其他模块
    ProductModule, // 添加这一行
  ],
})
export class AppModule {}
```

## 🔍 数据库操作详解

### 基本查询

```typescript
// 查询所有
const products = await this.repository.find();

// 根据条件查询
const product = await this.repository.findOne({
  where: { id: 1 },
});

// 查询多个
const products = await this.repository.find({
  where: { price: MoreThan(100) },
});
```

### 创建和更新

```typescript
// 创建
const product = this.repository.create(dto);
await this.repository.save(product);

// 更新
product.name = '新名称';
await this.repository.save(product);

// 或使用 update
await this.repository.update(id, { name: '新名称' });
```

### 删除

```typescript
// 删除
await this.repository.delete(id);

// 或先查询再删除
const product = await this.repository.findOne({ where: { id } });
await this.repository.remove(product);
```

### 关系查询

```typescript
// 查询关联数据
const product = await this.repository.findOne({
  where: { id: 1 },
  relations: ['category', 'reviews'],
});
```

## 💾 缓存使用详解

### 基本操作

```typescript
// 获取缓存
const value = await this.cacheManager.get<string>('key');

// 设置缓存（TTL：秒）
await this.cacheManager.set('key', 'value', 3600);

// 删除缓存
await this.cacheManager.del('key');

// 清空所有缓存
await this.cacheManager.reset();
```

### 缓存策略

1. **读取时**：先查缓存，再查数据库
2. **写入时**：更新数据库，清除相关缓存
3. **删除时**：删除数据库记录，清除相关缓存

## 📝 日志使用

```typescript
// 信息日志
this.logger.log('操作成功');

// 错误日志
this.logger.error('操作失败', error.stack);

// 警告日志
this.logger.warn('需要注意的问题');

// 调试日志
this.logger.debug('调试信息');
```

## 🧪 测试

### 单元测试

创建 `product.service.spec.ts`：

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## 🚀 部署

### 构建

```bash
npm run build
```

### 生产环境启动

```bash
npm run start:prod
```

### 环境变量

生产环境需要配置：

- `NODE_ENV=production`
- `DB_SYNCHRONIZE=false`（使用迁移管理数据库）
- `DB_LOGGING=false`（关闭 SQL 日志）

## 📚 常见问题

### 1. 数据库连接失败

检查：

- MySQL 服务是否启动
- `.env` 中的数据库配置是否正确
- 数据库是否存在

### 2. Redis 连接失败

检查：

- Redis 服务是否启动
- `.env` 中的 Redis 配置是否正确

### 3. 实体未创建表

检查：

- `DB_SYNCHRONIZE=true`（仅开发环境）
- 实体是否正确注册到模块
- 模块是否正确导入到 AppModule

## 🎯 最佳实践

1. **一个模块一个功能**：保持模块职责单一
2. **服务层处理业务逻辑**：控制器只处理 HTTP
3. **使用 DTO 验证数据**：确保数据正确性
4. **合理使用缓存**：提高性能
5. **记录重要日志**：便于问题排查
6. **错误处理**：使用 NestJS 内置异常
7. **类型安全**：充分利用 TypeScript

## 📖 总结

这个框架提供了：

- ✅ 完整的项目结构
- ✅ 数据库集成
- ✅ 缓存集成
- ✅ 日志系统
- ✅ 配置管理

基于这个框架，你可以：

- 快速创建新模块
- 复用通用功能
- 专注于业务逻辑开发

祝你开发愉快！🚀
