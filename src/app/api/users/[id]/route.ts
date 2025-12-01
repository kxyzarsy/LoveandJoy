import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { securityLogger } from '@/utils/security-logger';

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

// 获取单个用户或用户的博文数量
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    // 检查请求路径，确认是获取用户信息还是博文数量
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    const connection = await createConnection();
    
    // 如果是获取博文数量
    if (pathname.endsWith('/posts/count')) {
      const [postRows] = await connection.execute(
        'SELECT COUNT(*) as count FROM post WHERE authorId = ?',
        [id]
      );
      await connection.end();
      
      const postCount = (postRows as unknown)[0].count;
      return NextResponse.json({ count: postCount }, { status: 200 });
    }
    
    // 否则，获取单个用户信息
    const [rows] = await connection.execute(
      'SELECT id, name, email, usernameId, avatar, backgroundImage, bio, createdAt, updatedAt, lastUsernameChange FROM user WHERE id = ?',
      [id]
    );
    await connection.end();
    
    const user = (rows as unknown)[0];
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }
    
    // 计算剩余时间（如果有lastUsernameChange）
    let remainingHours = 0;
    if (user.lastUsernameChange) {
      const lastChangeTime = new Date(user.lastUsernameChange);
      const now = new Date();
      const diffHours = (now.getTime() - lastChangeTime.getTime()) / (1000 * 60 * 60);
      remainingHours = Math.max(0, Math.ceil(720 - diffHours));
    }
    
    return NextResponse.json({
      ...user,
      remainingUsernameChangeHours: remainingHours
    }, { status: 200 });
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return NextResponse.json({ error: '获取用户数据失败' }, { status: 500 });
  }
}

// 更新用户信息
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    const { name, email, password, avatar, bio, role, lastLoginAt, usernameId, backgroundImage } = body;
    
    // 管理员后台用户管理不需要权限限制，允许修改所有用户资料
    // 移除权限控制，因为管理员应该有权限修改所有用户
    
    const connection = await createConnection();
    
    // 开始事务
    await connection.beginTransaction();
    
    // 构建更新语句和参数
    const updateFields = [];
    const updateParams = [];
    
    // 只更新数据库中存在的字段
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateParams.push(name || null);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateParams.push(email || null);
    }
    if (password !== undefined && password) {
      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateParams.push(hashedPassword);
    }
    if (usernameId !== undefined) {
      updateFields.push('usernameId = ?');
      updateParams.push(usernameId || null);
      // 如果用户名ID被修改，更新lastUsernameChange字段
      updateFields.push('lastUsernameChange = NOW()');
    }
    if (avatar !== undefined) {
      let avatarValue = avatar || null;
      // 限制avatar字段长度，防止超过数据库字段限制
      if (avatarValue && typeof avatarValue === 'string') {
        // 如果是Data URL且长度超过1MB，使用默认头像
        if (avatarValue.startsWith('data:') && avatarValue.length > 1 * 1024 * 1024) {
          avatarValue = 'https://via.placeholder.com/100';
        } else if (avatarValue.length > 100000) {
          // 限制字符串长度不超过100KB
          avatarValue = avatarValue.substring(0, 100000);
        }
      }
      updateFields.push('avatar = ?');
      updateParams.push(avatarValue);
    }
    if (backgroundImage !== undefined) {
      let backgroundImageValue = backgroundImage || null;
      // 限制backgroundImage字段长度，防止超过数据库字段限制
      if (backgroundImageValue && typeof backgroundImageValue === 'string') {
        // 如果是Data URL且长度超过1MB，使用默认值
        if (backgroundImageValue.startsWith('data:') && backgroundImageValue.length > 1 * 1024 * 1024) {
          backgroundImageValue = null;
        } else if (backgroundImageValue.length > 100000) {
          // 限制字符串长度不超过100KB
          backgroundImageValue = backgroundImageValue.substring(0, 100000);
        }
      }
      updateFields.push('backgroundImage = ?');
      updateParams.push(backgroundImageValue);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateParams.push(bio || null);
    }
    if (role !== undefined) {
      updateFields.push('role = ?');
      updateParams.push(role || null);
    }
    
    updateFields.push('updatedAt = NOW()');
    updateParams.push(id);
    
    // 只有当有字段需要更新时才执行更新
    if (updateFields.length > 1) { // 至少有一个字段更新（不包括updatedAt）
      // 如果用户名ID被修改，检查唯一性
      if (usernameId !== undefined) {
        const [existingUserRows] = await connection.execute(
          'SELECT id FROM user WHERE usernameId = ? AND id != ?',
          [usernameId, id]
        );
        
        if ((existingUserRows as unknown).length > 0) {
          await connection.rollback();
          await connection.end();
          return NextResponse.json({
            error: '用户名ID已存在',
            message: '该用户名ID已被其他用户使用，请选择其他ID'
          }, { status: 400 });
        }
      }
      
      const [result] = await connection.execute(
        `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
      
      // 检查是否有行被更新
      if ((result as unknown).affectedRows === 0) {
        await connection.rollback();
        await connection.end();
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      }
    }
    
    // 获取更新后的用户信息
    const [updatedUserRows] = await connection.execute(
      'SELECT id, name, email, usernameId, avatar, backgroundImage, bio, createdAt, updatedAt, lastUsernameChange FROM user WHERE id = ?',
      [id]
    );
    
    const updatedUser = (updatedUserRows as unknown)[0];
    
    // 记录操作日志，特别是密码修改
    if (password !== undefined && password) {
      // 获取客户端IP
      const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
      
      // 记录密码修改日志
      securityLogger.logApiCall(
        '用户密码修改',
        {
          ipAddress,
          action: 'UPDATE_PASSWORD',
          resource: `/api/users/${id}`,
          status: 'SUCCESS',
          details: { userId: id, username: name || updatedUser?.name }
        }
      );
    }
    
    // 提交事务
    await connection.commit();
    await connection.end();
    
    // 计算剩余时间（如果有lastUsernameChange）
    let remainingHours = 0;
    if (updatedUser.lastUsernameChange) {
      const lastChangeTime = new Date(updatedUser.lastUsernameChange);
      const now = new Date();
      const diffHours = (now.getTime() - lastChangeTime.getTime()) / (1000 * 60 * 60);
      remainingHours = Math.max(0, Math.ceil(720 - diffHours));
    }
    
    return NextResponse.json({
      ...updatedUser,
      remainingUsernameChangeHours: remainingHours
    }, { status: 200 });
  } catch (error) {
    console.error('更新用户数据失败:', error);
    return NextResponse.json({ error: '更新用户数据失败', details: (error as Error).message }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    // 获取请求体，检查是否需要删除关联的博文
    const body = await request.json().catch(() => ({}));
    const deletePosts = body.deletePosts || false;
    
    const connection = await createConnection();
    
    // 开始事务
    await connection.beginTransaction();
    
    try {
      // 先获取要删除的用户信息
      const [userRows] = await connection.execute(
        'SELECT id, name, email, usernameId, avatar, bio, createdAt, updatedAt FROM user WHERE id = ?',
        [id]
      );
      
      const user = (userRows as unknown)[0];
      if (!user) {
        await connection.rollback();
        await connection.end();
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      }
      
      if (deletePosts) {
        // 删除关联的博文
        await connection.execute('DELETE FROM post WHERE authorId = ?', [id]);
      } else {
        // 检查是否有关联的帖子
        const [postRows] = await connection.execute(
          'SELECT COUNT(*) as postCount FROM post WHERE authorId = ?',
          [id]
        );
        
        const postCount = (postRows as unknown)[0].postCount;
        if (postCount > 0) {
          await connection.rollback();
          await connection.end();
          return NextResponse.json({
            error: '删除用户失败',
            message: `该用户还有${postCount}个关联的帖子，无法直接删除。请先删除这些帖子，或联系管理员处理。`
          }, { status: 400 });
        }
      }
      
      // 删除用户
      await connection.execute('DELETE FROM user WHERE id = ?', [id]);
      
      // 提交事务
      await connection.commit();
      await connection.end();
      
      return NextResponse.json(user, { status: 200 });
    } catch (error: unknown) {
      // 回滚事务
      await connection.rollback();
      await connection.end();
      
      // 处理外键约束错误
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({
          error: '删除用户失败',
          message: '该用户还有关联的数据（如帖子），无法直接删除。请先删除这些关联数据，或联系管理员处理。'
        }, { status: 400 });
      }
      
      throw error;
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 });
  }
}