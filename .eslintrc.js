module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import/typescript',
    'plugin:prettier/recommended', // 必须最后
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', 'coverage'],
  rules: {
    // 类型安全
    '@typescript-eslint/no-explicit-any': 'off', // 允许 any
    '@typescript-eslint/no-unused-vars': 'off', // TypeScript 已处理
    '@typescript-eslint/no-inferrable-types': 'off', // 允许可推断类型

    // 关闭一些过严的规则
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    'no-console': 'off',

    // 导入排序（完全关闭，容易误报）
    'import/order': 'off',
    'import/no-cycle': 'off',
    'import/no-duplicates': 'error',

    // Prettier 兼容性 - 允许空类体中有空格（与 Prettier 默认行为一致）
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
        fileInfoOptions: {
          withNodeModules: false,
        },
      },
    ],
  },
  overrides: [
    // 配置文件使用更宽松的规则
    {
      files: ['src/config/**/*.ts', 'src/**/*.config.ts', 'src/shared/config/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    // 测试文件使用更宽松的规则
    {
      files: ['**/*.spec.ts', '**/*.e2e-spec.ts', 'test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
