/**
 * 统一错误处理工具
 * 用于在整个应用中实现一致的错误捕获、处理和返回机制
 */

// 基础错误代码枚举
export enum ErrorCode {
  // 通用错误
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // 认证相关
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  TOKEN_ERROR = 'TOKEN_ERROR',
  SESSION_ERROR = 'SESSION_ERROR',
  
  // 数据库相关
  DATABASE_ERROR = 'DATABASE_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  CONSTRAINT_ERROR = 'CONSTRAINT_ERROR',
  FOREIGN_KEY_ERROR = 'FOREIGN_KEY_ERROR',
  UNIQUE_CONSTRAINT_ERROR = 'UNIQUE_CONSTRAINT_ERROR',
  
  // 业务相关
  USER_ERROR = 'USER_ERROR',
  POST_ERROR = 'POST_ERROR',
  CATEGORY_ERROR = 'CATEGORY_ERROR',
  COMMENT_ERROR = 'COMMENT_ERROR',
  
  // 安全相关
  SECURITY_ERROR = 'SECURITY_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

// 统一错误响应接口
export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    timestamp: string;
    requestId?: string;
  };
  success: false;
}

// 自定义错误类
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown,
    public requestId?: string
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// 生成唯一请求ID
const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 创建错误响应
export const createErrorResponse = (error: AppError | Error, requestId?: string): ErrorResponse => {
  const timestamp = new Date().toISOString();
  const reqId = requestId || generateRequestId();
  
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp,
        requestId: error.requestId || reqId,
      },
    };
  }
  
  // 处理未知错误
  return {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp,
      requestId: reqId,
    },
  };
};

// 错误处理中间件（用于API路由）
export const handleApiError = async (
  fn: () => Promise<Response>,
  requestId?: string
): Promise<Response> => {
  try {
    return await fn();
  } catch (error) {
    const errorResponse = createErrorResponse(error as Error, requestId);
    
    // 根据错误代码设置HTTP状态码
    const statusCode = getStatusCodeForError(errorResponse.error.code);
    
    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': errorResponse.error.requestId!,
      },
    });
  }
};

// 获取错误对应的HTTP状态码
const getStatusCodeForError = (code: ErrorCode): number => {
  const statusMap: Record<ErrorCode, number> = {
    [ErrorCode.BAD_REQUEST]: 400,
    [ErrorCode.NOT_FOUND]: 404,
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.FORBIDDEN]: 403,
    [ErrorCode.CONFLICT]: 409,
    [ErrorCode.VALIDATION_ERROR]: 400,
    [ErrorCode.VALIDATION_FAILED]: 400,
    [ErrorCode.NETWORK_ERROR]: 503,
    [ErrorCode.TIMEOUT_ERROR]: 504,
    [ErrorCode.SERVICE_UNAVAILABLE]: 503,
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCode.UNPROCESSABLE_ENTITY]: 422,
    [ErrorCode.TOO_MANY_REQUESTS]: 429,
    [ErrorCode.AUTHENTICATION_ERROR]: 401,
    [ErrorCode.AUTHORIZATION_ERROR]: 403,
    [ErrorCode.TOKEN_ERROR]: 401,
    [ErrorCode.SESSION_ERROR]: 401,
    [ErrorCode.DATABASE_ERROR]: 500,
    [ErrorCode.TRANSACTION_ERROR]: 500,
    [ErrorCode.CONSTRAINT_ERROR]: 400,
    [ErrorCode.FOREIGN_KEY_ERROR]: 400,
    [ErrorCode.UNIQUE_CONSTRAINT_ERROR]: 409,
    [ErrorCode.USER_ERROR]: 400,
    [ErrorCode.POST_ERROR]: 400,
    [ErrorCode.CATEGORY_ERROR]: 400,
    [ErrorCode.COMMENT_ERROR]: 400,
    [ErrorCode.SECURITY_ERROR]: 403,
    [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  };
  
  return statusMap[code] || 500;
};

// 验证错误处理
export const handleValidationError = (errors: unknown[]): AppError => {
  return new AppError(
    ErrorCode.VALIDATION_ERROR,
    'Validation failed',
    { errors }
  );
};

// 数据库错误处理
export const handleDatabaseError = (error: unknown): AppError => {
  let code = ErrorCode.DATABASE_ERROR;
  let message = 'Database operation failed';
  
  // 根据错误信息识别具体错误类型
  if ((error as any).code) {
    switch ((error as any).code) {
      case 'ER_DUP_ENTRY':
        code = ErrorCode.UNIQUE_CONSTRAINT_ERROR;
        message = 'Duplicate entry';
        break;
      case 'ER_NO_REFERENCED_ROW_2':
      case 'ER_ROW_IS_REFERENCED_2':
        code = ErrorCode.FOREIGN_KEY_ERROR;
        message = 'Foreign key constraint violation';
        break;
      case 'ER_BAD_NULL_ERROR':
        code = ErrorCode.CONSTRAINT_ERROR;
        message = 'Not null constraint violation';
        break;
      default:
        break;
    }
  }
  
  return new AppError(code, message, process.env.NODE_ENV === 'development' ? error : undefined);
};
