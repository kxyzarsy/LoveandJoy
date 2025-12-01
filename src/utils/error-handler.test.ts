import { 
  AppError, 
  ErrorCode, 
  createErrorResponse, 
  handleApiError, 
  handleValidationError, 
  handleDatabaseError 
} from './error-handler';

describe('Error Handler', () => {
  describe('AppError', () => {
    it('应该创建一个带有正确属性的AppError实例', () => {
      const code = ErrorCode.BAD_REQUEST;
      const message = 'Bad request';
      const details = { field: 'email', error: 'Invalid email' };
      const requestId = 'test-request-id';
      
      const error = new AppError(code, message, details, requestId);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(code);
      expect(error.message).toBe(message);
      expect(error.details).toEqual(details);
      expect(error.requestId).toBe(requestId);
    });
    
    it('应该创建一个没有details和requestId的AppError实例', () => {
      const code = ErrorCode.INTERNAL_SERVER_ERROR;
      const message = 'Internal server error';
      
      const error = new AppError(code, message);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(code);
      expect(error.message).toBe(message);
      expect(error.details).toBeUndefined();
      expect(error.requestId).toBeUndefined();
    });
  });
  
  describe('createErrorResponse', () => {
    it('应该从AppError创建正确的错误响应', () => {
      const code = ErrorCode.BAD_REQUEST;
      const message = 'Bad request';
      const details = { field: 'email', error: 'Invalid email' };
      const requestId = 'test-request-id';
      
      const appError = new AppError(code, message, details, requestId);
      const errorResponse = createErrorResponse(appError);
      
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe(code);
      expect(errorResponse.error.message).toBe(message);
      expect(errorResponse.error.details).toEqual(details);
      expect(errorResponse.error.requestId).toBe(requestId);
      expect(errorResponse.error.timestamp).toBeDefined();
    });
    
    it('应该从普通Error创建正确的错误响应', () => {
      const message = 'Unknown error';
      const error = new Error(message);
      
      const errorResponse = createErrorResponse(error);
      
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
      expect(errorResponse.error.message).toBe(message);
      expect(errorResponse.error.requestId).toBeDefined();
      expect(errorResponse.error.timestamp).toBeDefined();
    });
    
    it('应该使用提供的requestId', () => {
      const code = ErrorCode.NOT_FOUND;
      const message = 'Not found';
      const appError = new AppError(code, message);
      const requestId = 'provided-request-id';
      
      const errorResponse = createErrorResponse(appError, requestId);
      
      expect(errorResponse.error.requestId).toBe(requestId);
    });
  });
  
  describe('handleApiError', () => {
    it('应该返回成功响应当没有错误时', async () => {
      const mockResponse = new Response(JSON.stringify({ success: true, data: { id: 1, name: 'Test' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await handleApiError(async () => mockResponse);
      
      expect(result).toBe(mockResponse);
    });
    
    it('应该捕获AppError并返回正确的错误响应', async () => {
      const code = ErrorCode.BAD_REQUEST;
      const message = 'Bad request';
      const details = { field: 'email', error: 'Invalid email' };
      
      const result = await handleApiError(async () => {
        throw new AppError(code, message, details);
      });
      
      expect(result.status).toBe(400);
      const responseBody = await result.json();
      expect(responseBody.success).toBe(false);
      expect(responseBody.error.code).toBe(code);
      expect(responseBody.error.message).toBe(message);
      expect(responseBody.error.details).toEqual(details);
    });
    
    it('应该捕获普通Error并返回内部服务器错误', async () => {
      const message = 'Unknown error';
      
      const result = await handleApiError(async () => {
        throw new Error(message);
      });
      
      expect(result.status).toBe(500);
      const responseBody = await result.json();
      expect(responseBody.success).toBe(false);
      expect(responseBody.error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
      expect(responseBody.error.message).toBe(message);
    });
  });
  
  describe('handleValidationError', () => {
    it('应该创建带有验证错误的AppError', () => {
      const errors = [
        { field: 'email', error: 'Invalid email' },
        { field: 'password', error: 'Password too short' }
      ];
      
      const error = handleValidationError(errors);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual({ errors });
    });
    
    it('应该创建带有空错误数组的AppError', () => {
      const errors: unknown[] = [];
      
      const error = handleValidationError(errors);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual({ errors });
    });
  });
  
  describe('handleDatabaseError', () => {
    it('应该处理重复条目错误', () => {
      const mysqlError = {
        code: 'ER_DUP_ENTRY',
        message: 'Duplicate entry for key' 
      };
      
      const error = handleDatabaseError(mysqlError);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.UNIQUE_CONSTRAINT_ERROR);
      expect(error.message).toBe('Duplicate entry');
    });
    
    it('应该处理外键约束错误', () => {
      const mysqlError1 = {
        code: 'ER_NO_REFERENCED_ROW_2',
        message: 'Cannot add or update a child row' 
      };
      
      const error1 = handleDatabaseError(mysqlError1);
      
      expect(error1).toBeInstanceOf(AppError);
      expect(error1.code).toBe(ErrorCode.FOREIGN_KEY_ERROR);
      expect(error1.message).toBe('Foreign key constraint violation');
      
      const mysqlError2 = {
        code: 'ER_ROW_IS_REFERENCED_2',
        message: 'Cannot delete or update a parent row' 
      };
      
      const error2 = handleDatabaseError(mysqlError2);
      
      expect(error2).toBeInstanceOf(AppError);
      expect(error2.code).toBe(ErrorCode.FOREIGN_KEY_ERROR);
      expect(error2.message).toBe('Foreign key constraint violation');
    });
    
    it('应该处理非空约束错误', () => {
      const mysqlError = {
        code: 'ER_BAD_NULL_ERROR',
        message: 'Column cannot be null' 
      };
      
      const error = handleDatabaseError(mysqlError);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.CONSTRAINT_ERROR);
      expect(error.message).toBe('Not null constraint violation');
    });
    
    it('应该处理未知数据库错误', () => {
      const mysqlError = {
        code: 'UNKNOWN_ERROR',
        message: 'Unknown database error' 
      };
      
      const error = handleDatabaseError(mysqlError);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.DATABASE_ERROR);
      expect(error.message).toBe('Database operation failed');
    });
    
    it('应该处理没有code的数据库错误', () => {
      const mysqlError = {
        message: 'Database connection failed' 
      };
      
      const error = handleDatabaseError(mysqlError);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.DATABASE_ERROR);
      expect(error.message).toBe('Database operation failed');
    });
  });
});
