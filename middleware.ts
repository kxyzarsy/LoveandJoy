import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// JWT验证中间件
export function middleware(request: NextRequest) {
  // 不需要验证的路由
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/send-verification-code',
    '/api/posts',
    '/api/footer-config'
  ];
  
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path) || 
    request.nextUrl.pathname === path
  );
  
  // 公开路由直接放行
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // 从请求头获取Authorization令牌
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // 没有令牌，返回401错误
  if (!token) {
    return NextResponse.json({ 
      success: false, 
      error: '未授权访问',
      message: '请先登录' 
    }, { status: 401 });
  }
  
  try {
    // 验证JWT令牌
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secretKey) as {
      userId: number;
      email: string;
      role: string;
    };
    
    // 检查是否需要管理员权限
    const adminOnlyPaths = [
      '/api/admin',
      '/api/dashboard-stats',
      '/api/users',
      '/api/comments'
    ];
    
    const requiresAdmin = adminOnlyPaths.some(path => 
      request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
    );
    
    console.log('Request path:', request.nextUrl.pathname);
    console.log('Requires admin:', requiresAdmin);
    
    // 如果需要管理员权限，但用户不是管理员，返回403错误
    if (requiresAdmin && decoded.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: '权限不足',
        message: '需要管理员权限才能访问此资源' 
      }, { status: 403 });
    }
    
    // 将用户信息添加到请求头中，供后续API路由使用
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Id', decoded.userId.toString());
    requestHeaders.set('X-User-Email', decoded.email);
    requestHeaders.set('X-User-Role', decoded.role);
    
    // 允许请求继续
    return NextResponse.next({ headers: requestHeaders });
  } catch (error) {
    console.error('JWT验证失败:', error);
    
    // 令牌无效或过期，返回401错误
    return NextResponse.json({ 
      success: false, 
      error: '无效的令牌',
      message: '登录已过期，请重新登录' 
    }, { status: 401 });
  }
}

// 配置中间件应用的路由
export const config = {
  matcher: '/api/:path*',
};