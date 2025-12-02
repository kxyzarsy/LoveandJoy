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

// 修改用户密码
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    const body = await request.json();
    const { oldPassword, newPassword } = body;
    
    // 验证请求参数
    if (!oldPassword || !newPassword) {
      return NextResponse.json({
        error: '参数缺失',
        message: '请提供旧密码和新密码'
      }, { status: 400 });
    }
    
    // 验证新密码强度
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json({
        error: '密码强度不足',
        message: '新密码至少需要8位，包含大小写字母、数字和特殊符号'
      }, { status: 400 });
    }
    
    // 权限控制：从请求头中获取当前登录用户ID
    const currentUserId = parseInt(request.headers.get('X-User-Id') || '0');
    
    // 验证当前用户是否有权限修改该用户密码
    if (currentUserId !== userId) {
      return NextResponse.json({ 
        error: '没有权限修改其他用户密码',
        message: '您只能修改自己的密码' 
      }, { status: 403 });
    }
    
    const connection = await createConnection();
    
    // 开始事务
    await connection.beginTransaction();
    
    // 验证旧密码
    const [userRows] = await connection.execute(
      'SELECT password FROM user WHERE id = ?',
      [userId]
    );
    
    const user = (userRows as any[])[0];
    if (!user) {
      await connection.rollback();
      await connection.end();
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }
    
    // 注意：在实际生产环境中，应该使用bcrypt等加密算法来验证密码
    // 这里为了简化，我们直接比对密码
    if (user.password !== oldPassword) {
      await connection.rollback();
      await connection.end();
      return NextResponse.json({
        error: '旧密码错误',
        message: '请输入正确的旧密码'
      }, { status: 401 });
    }
    
    // 更新密码
    await connection.execute(
      'UPDATE user SET password = ?, updatedAt = NOW() WHERE id = ?',
      [newPassword, userId]
    );
    
    // 提交事务
    await connection.commit();
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: '密码修改成功',
      data: { userId }
    }, { status: 200 });
    
  } catch (error) {
    console.error('修改密码失败:', error);
    return NextResponse.json({
      error: '修改密码失败',
      message: '密码修改失败，请稍后重试',
      details: (error as Error).message
    }, { status: 500 });
  }
}
