/** @type {import('jest').Config} */
const config = {
  // 测试环境配置
  testEnvironment: 'jsdom',
  
  // 测试文件匹配模式
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  
  // 模块名称映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // 模块文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // 覆盖率配置
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/app/**/*.tsx', // 排除页面组件
    '!src/app/api/**/*.ts', // 排除API路由
    '!src/lib/db-pool.ts', // 排除数据库连接池
    '!src/utils/违禁词检测.ts', // 排除违禁词检测工具
    '!src/generated/**/*', // 排除自动生成的文件
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  
  // 覆盖率阈值配置
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // 转换配置
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }]
  },
  
  // 转换忽略模式
  transformIgnorePatterns: [
    'node_modules/(?!(axios|react-markdown|react-syntax-highlighter)/)',
    '^.+\.module\.(css|sass|scss)$'
  ],
  
  // 设置setupFilesAfterEnv，用于配置测试环境
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 启用自动清理模拟
  clearMocks: true,
  
  // 显示测试覆盖率摘要
  verbose: true,
  
  // 忽略特定文件
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/src/generated/'
  ]
};

module.exports = config;
