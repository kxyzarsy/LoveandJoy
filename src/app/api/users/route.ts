import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { executeQuery } from '@/lib/db-pool';
import { handleApiError, AppError, ErrorCode } from '@/utils/error-handler';
import { securityLogger } from '@/utils/security-logger';

// 用户创建请求的输入验证schema
const createUserSchema = z.object({
  name: z.string().min(1, '用户名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码长度不能少于6个字符'),
  usernameId: z.string().min(1, '用户名ID不能为空'),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  role: z.string().optional().default('user')
});

// 获取所有用户
export async function GET(request: Request) {
  // 获取客户端IP
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
  
  return handleApiError(async () => {
    const url = new URL(request.url);
    const usernameId = url.searchParams.get('usernameId');
    
    let query = '';
    let params: unknown[] = [];
    
    if (usernameId) {
      // 根据usernameId查询特定用户
      query = 'SELECT id, name, email, usernameId, avatar, backgroundImage, bio, role, inactive, createdAt, updatedAt FROM user WHERE usernameId = ?';
      params = [usernameId];
    } else {
      // 获取所有用户
      query = 'SELECT id, name, email, usernameId, avatar, backgroundImage, bio, role, inactive, createdAt, updatedAt FROM user';
    }
    
    const [rows] = await executeQuery(query, params);
    
    // 计算每个用户的剩余用户名修改时间
    const usersWithRemainingTime = (rows as unknown[]).map((user: any) => {
      let remainingHours = 0;
      if (user.lastUsernameChange) {
        const lastChangeTime = new Date(user.lastUsernameChange);
        const now = new Date();
        const diffHours = (now.getTime() - lastChangeTime.getTime()) / (1000 * 60 * 60);
        remainingHours = Math.max(0, 72 - diffHours);
      }
      return {
        ...user,
        remainingUsernameChangeHours: remainingHours
      };
    });
    
    // 记录API调用日志
    securityLogger.logApiCall(
      usernameId ? '根据用户名ID获取用户成功' : '获取所有用户成功',
      {
        ipAddress,
        action: 'GET',
        resource: '/api/users',
        status: 'SUCCESS',
        details: usernameId ? { usernameId } : { count: usersWithRemainingTime.length }
      }
    );
    
    return NextResponse.json(usersWithRemainingTime, { status: 200 });
  });
}

// 添加新用户
export async function POST(request: Request) {
  // 获取客户端IP
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
  
  return handleApiError(async () => {
    const body = await request.json();
    
    // 使用zod验证请求参数
    const validatedData = createUserSchema.parse(body);
    const { name, email, password, usernameId, avatar, bio, role } = validatedData;
    
    // 检查用户名ID是否已存在
    const [existingUserRows] = await executeQuery(
      'SELECT id FROM user WHERE usernameId = ?',
      [usernameId]
    );
    
    if ((existingUserRows as any[]).length > 0) {
      // 记录安全日志
      securityLogger.logSecurityViolation(
        '用户名ID已存在',
        {
          ipAddress,
          action: 'CREATE_USER',
          resource: '/api/users',
          details: { usernameId, email }
        }
      );
      
      throw new AppError(ErrorCode.CONFLICT, '用户名ID已存在', {
        message: '该用户名ID已被其他用户使用，请选择其他ID'
      });
    }
    
    // 检查邮箱是否已存在
    const [existingEmailRows] = await executeQuery(
      'SELECT id FROM user WHERE email = ?',
      [email]
    );
    
    if ((existingEmailRows as any[]).length > 0) {
      // 记录安全日志
      securityLogger.logSecurityViolation(
        '邮箱已存在',
        {
          ipAddress,
          action: 'CREATE_USER',
          resource: '/api/users',
          details: { email }
        }
      );
      
      throw new AppError(ErrorCode.CONFLICT, '邮箱已存在', {
        message: '该邮箱已被其他用户使用，请选择其他邮箱'
      });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await executeQuery(
      'INSERT INTO user (name, email, password, usernameId, avatar, bio, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, usernameId, avatar || null, bio || null, role]
    );
    
    const [newUser] = await executeQuery(
      'SELECT id, name, email, usernameId, avatar, backgroundImage, bio, role, inactive, createdAt, updatedAt FROM user WHERE id = ?',
      [(result as { insertId: number }).insertId]
    );
    
    const createdUser = (newUser as any[])[0];
    
    // 记录用户创建日志
    securityLogger.logApiCall(
      '创建用户成功',
      {
        ipAddress,
        action: 'CREATE_USER',
        resource: '/api/users',
        status: 'SUCCESS',
        details: { userId: createdUser.id, username: createdUser.name, email: createdUser.email }
      }
    );
    
    return NextResponse.json({
      ...createdUser,
      remainingUsernameChangeHours: 0 // 新用户可以立即修改用户名ID
    }, { status: 201 });
  });
}