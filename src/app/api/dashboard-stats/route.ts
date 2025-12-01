import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// 创建数据库连接
async function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'yueblog'
  });
}

// 验证JWT令牌
async function verifyToken(request: Request) {
  // 从请求头获取Authorization令牌
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // 没有令牌，返回401错误
  if (!token) {
    return { valid: false, error: '未授权访问', status: 401 };
  }
  
  try {
    // 验证JWT令牌
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secretKey) as {
      userId: number;
      email: string;
      role: string;
    };
    
    // 检查用户是否为管理员
    if (decoded.role !== 'admin') {
      return { valid: false, error: '权限不足', status: 403 };
    }
    
    return { valid: true, decoded };
  } catch (error) {
    console.error('JWT验证失败:', error);
    return { valid: false, error: '无效的令牌', status: 401 };
  }
}

// 定义统计数据类型
interface StatsResult {
  count: number;
}

interface DashboardStats {
  success: boolean;
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalCategories: number;
  timestamp: number;
}

// 缓存数据和过期时间
let cachedStats: DashboardStats | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 60 * 1000; // 1分钟缓存

// 获取仪表盘统计数据
export async function GET(request: Request) {
  // 验证令牌
  const tokenVerification = await verifyToken(request);
  if (!tokenVerification.valid) {
    return NextResponse.json({
      success: false,
      error: tokenVerification.error
    }, { status: tokenVerification.status });
  }

  try {
    // 检查缓存是否有效
    const now = Date.now();
    if (cachedStats && now < cacheExpiry) {
      return NextResponse.json(cachedStats, { status: 200 });
    }

    // 连接数据库
    const connection = await createConnection();
    
    // 查询各表统计数据
    const [postsResult] = await connection.execute('SELECT COUNT(*) as count FROM post');
    const [usersResult] = await connection.execute('SELECT COUNT(*) as count FROM user');
    const [commentsResult] = await connection.execute('SELECT COUNT(*) as count FROM comment');
    const [categoriesResult] = await connection.execute('SELECT COUNT(*) as count FROM category');
    
    await connection.end();
    
    // 解析查询结果
    const totalPosts = (postsResult as any[])[0].count;
    const totalUsers = (usersResult as any[])[0].count;
    const totalComments = (commentsResult as any[])[0].count;
    const totalCategories = (categoriesResult as any[])[0].count;
    
    // 构建统计数据
    const stats = {
      success: true,
      timestamp: Date.now(),
      totalPosts,
      totalUsers,
      totalComments,
      totalCategories,
      lastUpdated: new Date().toISOString(),
      dataSource: 'database' // 明确标记数据来源为数据库
    };

    // 更新缓存
    cachedStats = stats;
    cacheExpiry = now + CACHE_DURATION;

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('获取仪表盘统计数据失败:', error);
    
    // 返回模拟数据作为最后的后备
    const fallbackStats = {
      totalPosts: 0,
      totalUsers: 0,
      totalComments: 0,
      totalCategories: 0,
      lastUpdated: new Date().toISOString(),
      dataSource: 'fallback'
    };
    
    return NextResponse.json(fallbackStats, { status: 200 });
  }
}