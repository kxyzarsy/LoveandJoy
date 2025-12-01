import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

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

// 检查并标记不活跃用户
export async function POST() {
  try {
    const connection = await createConnection();
    
    // 记录开始时间
    const startTime = new Date();
    console.log(`[${startTime.toISOString()}] 开始检查不活跃用户`);
    
    // 标记连续30天未登录的用户为不活跃
    const [result] = await connection.execute(
      `UPDATE user 
       SET inactive = true 
       WHERE lastLoginAt < DATE_SUB(NOW(), INTERVAL 30 DAY) 
       AND inactive = false`
    );
    
    // 标记最近30天登录的用户为活跃
    await connection.execute(
      `UPDATE user 
       SET inactive = false 
       WHERE lastLoginAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
       AND inactive = true`
    );
    
    await connection.end();
    
    // 记录结束时间和结果
    const endTime = new Date();
    const affectedRows = (result as unknown).affectedRows || 0;
    console.log(`[${endTime.toISOString()}] 不活跃用户检查完成，共标记 ${affectedRows} 个用户为不活跃状态`);
    
    return NextResponse.json({
      success: true,
      message: '不活跃用户检查完成',
      affectedRows,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('检查不活跃用户失败:', error);
    return NextResponse.json(
      { success: false, message: '检查不活跃用户失败', error: (error as Error).message }, 
      { status: 500 }
    );
  }
}

// 获取不活跃用户统计
export async function GET() {
  try {
    const connection = await createConnection();
    
    // 获取不活跃用户数量
    const [inactiveCountResult] = await connection.execute(
      'SELECT COUNT(*) as inactiveCount FROM user WHERE inactive = true'
    );
    
    // 获取活跃用户数量
    const [activeCountResult] = await connection.execute(
      'SELECT COUNT(*) as activeCount FROM user WHERE inactive = false'
    );
    
    // 获取总用户数量
    const [totalCountResult] = await connection.execute(
      'SELECT COUNT(*) as totalCount FROM user'
    );
    
    await connection.end();
    
    const inactiveCount = (inactiveCountResult as unknown)[0].inactiveCount;
    const activeCount = (activeCountResult as unknown)[0].activeCount;
    const totalCount = (totalCountResult as unknown)[0].totalCount;
    
    return NextResponse.json({
      success: true,
      data: {
        inactiveCount,
        activeCount,
        totalCount,
        inactivePercentage: totalCount > 0 ? Math.round((inactiveCount / totalCount) * 100) : 0
      }
    }, { status: 200 });
  } catch (error) {
    console.error('获取不活跃用户统计失败:', error);
    return NextResponse.json(
      { success: false, message: '获取不活跃用户统计失败', error: (error as Error).message }, 
      { status: 500 }
    );
  }
}
