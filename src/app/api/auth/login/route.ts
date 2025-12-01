import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { executeQuery } from '@/lib/db-pool';
import { handleApiError, AppError, ErrorCode, createErrorResponse } from '@/utils/error-handler';
import { securityLogger, LogType } from '@/utils/security-logger';

// 登录请求的输入验证schema
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码长度不能少于6个字符')
});

// 生成JWT令牌
function generateToken(userId: number, email: string, role: string) {
  // 使用环境变量或安全的密钥
  const secretKey = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn = '2h'; // 令牌过期时间
  
  return jwt.sign(
    { userId, email, role },
    secretKey,
    { expiresIn }
  );
}

// 登录接口
export async function POST(request: Request) {
  // 获取客户端IP和User-Agent
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return handleApiError(async () => {
    const body = await request.json();
    
    // 使用zod验证请求参数
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    
    // 查询用户
    const [rows] = await executeQuery(
      'SELECT id, name, email, password, usernameId, avatar, role FROM user WHERE email = ?',
      [email]
    );
    
    // 定义用户类型
    interface User {
      id: number;
      name: string;
      email: string;
      password: string;
      usernameId: string;
      avatar: string;
      role: string;
    }
    
    // 检查用户是否存在
    const users = rows as User[];
    if (users.length === 0) {
      // 记录登录失败日志
      securityLogger.logAuthentication(
        '登录失败：用户不存在',
        {
          ipAddress,
          userAgent,
          action: 'LOGIN',
          status: 'FAILURE',
          details: { email }
        }
      );
      
      throw new AppError(ErrorCode.AUTHENTICATION_ERROR, '账号不存在');
    }
    
    const user = users[0];
    
    // 验证密码 - 兼容明文密码和bcrypt加密密码
    let isPasswordValid = false;
    
    // 检查密码是否为bcrypt加密格式
    if (user.password.startsWith('$2b$')) {
      // 使用bcrypt验证
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // 直接比较明文密码（兼容旧数据）
      isPasswordValid = password === user.password;
      
      // 如果验证成功，将明文密码转换为bcrypt加密格式并更新到数据库
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await executeQuery(
          'UPDATE user SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );
      }
    }
    
    if (!isPasswordValid) {
      // 记录登录失败日志
      securityLogger.logAuthentication(
        '登录失败：密码错误',
        {
          userId: user.id.toString(),
          username: user.name,
          ipAddress,
          userAgent,
          action: 'LOGIN',
          status: 'FAILURE',
          details: { email }
        }
      );
      
      throw new AppError(ErrorCode.AUTHENTICATION_ERROR, '密码错误');
    }
    
    // 更新用户的最后登录时间
    await executeQuery(
      'UPDATE user SET lastLoginAt = NOW() WHERE id = ?',
      [user.id]
    );
    
    // 生成JWT令牌
    const token = generateToken(user.id, user.email, user.role);
    
    // 构建响应数据
    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      usernameId: user.usernameId,
      avatar: user.avatar,
      role: user.role
    };
    
    // 记录登录成功日志
    securityLogger.logAuthentication(
      '登录成功',
      {
        userId: user.id.toString(),
        username: user.name,
        ipAddress,
        userAgent,
        action: 'LOGIN',
        status: 'SUCCESS',
        details: { email, role: user.role }
      }
    );
    
    // 记录API调用日志
    securityLogger.logApiCall(
      '登录API调用成功',
      {
        userId: user.id.toString(),
        username: user.name,
        ipAddress,
        userAgent,
        action: 'POST',
        resource: '/api/auth/login',
        status: 'SUCCESS',
        details: { email }
      }
    );
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: {
        token,
        userInfo
      },
      message: '登录成功'
    }, { status: 200 });
  });
}
