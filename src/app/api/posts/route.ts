import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { detectSensitiveWords, hasSensitiveWords } from '../../../utils/违禁词检测';

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

// 获取所有文章
export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      `SELECT 
        p.id, p.title, p.excerpt, p.content, p.image, p.readTime, 
        p.authorId, p.categoryId, p.createdAt, p.updatedAt, p.status,
        p.foundSensitiveWords, p.reviewedBy, p.reviewedAt, p.rejectionReason,
        u.name as authorName, u.avatar as authorAvatar,
        c.name as categoryName, c.slug as categorySlug
      FROM post p
      LEFT JOIN user u ON p.authorId = u.id
      LEFT JOIN category c ON p.categoryId = c.id
      ORDER BY p.createdAt DESC`
    );
    await connection.end();
    
    // 转换数据格式
    const posts = (rows as unknown[]).map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      readTime: post.readTime,
      authorId: post.authorId,
      categoryId: post.categoryId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      status: post.status as 'published' | 'pending' | 'rejected',
      foundSensitiveWords: post.foundSensitiveWords ? JSON.parse(post.foundSensitiveWords) : [],
      reviewedBy: post.reviewedBy,
      reviewedAt: post.reviewedAt,
      rejectionReason: post.rejectionReason,
      likes: 0, // 添加点赞数默认值
      author: {
        id: post.authorId,
        name: post.authorName,
        avatar: post.authorAvatar
      },
      category: {
        id: post.categoryId,
        name: post.categoryName,
        slug: post.categorySlug
      },
      comments: []
    }));
    
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('获取文章数据失败:', error);
    return NextResponse.json({ error: '获取文章数据失败' }, { status: 500 });
  }
}

// 创建新文章
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, categoryId, image, authorId, readTime } = body;

    // 检测违禁词
    const allText = `${title} ${excerpt} ${content}`;
    const foundWords = detectSensitiveWords(allText);
    const hasSensitive = hasSensitiveWords(allText);
    
    // 根据敏感词检测结果设置文章状态
    const status = hasSensitive ? 'pending' : 'published';

    const connection = await createConnection();
    const now = new Date();
    const [result] = await connection.execute(
      `INSERT INTO post (title, excerpt, content, categoryId, image, authorId, readTime, status, foundSensitiveWords, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, excerpt, content, categoryId, image || null, authorId, readTime || null, status, JSON.stringify(foundWords), now, now]
    );
    
    // 获取新创建的文章
    const [newPostRows] = await connection.execute(
      `SELECT 
        p.id, p.title, p.excerpt, p.content, p.image, p.readTime, 
        p.authorId, p.categoryId, p.status, p.foundSensitiveWords, p.createdAt, p.updatedAt,
        u.name as authorName, u.avatar as authorAvatar,
        c.name as categoryName, c.slug as categorySlug
      FROM post p
      LEFT JOIN user u ON p.authorId = u.id
      LEFT JOIN category c ON p.categoryId = c.id
      WHERE p.id = ?`,
      [(result as unknown).insertId]
    );
    
    await connection.end();
    
    const newPost = (newPostRows as unknown)[0];
    
    // 转换数据格式
    const formattedPost = {
      id: newPost.id,
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      image: newPost.image,
      readTime: newPost.readTime,
      authorId: newPost.authorId,
      categoryId: newPost.categoryId,
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt,
      status: newPost.status as 'published' | 'pending' | 'rejected',
      foundSensitiveWords: newPost.foundSensitiveWords ? JSON.parse(newPost.foundSensitiveWords) : [],
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      author: {
        id: newPost.authorId,
        name: newPost.authorName,
        avatar: newPost.authorAvatar
      },
      category: {
        id: newPost.categoryId,
        name: newPost.categoryName,
        slug: newPost.categorySlug
      },
      comments: []
    };
    
    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}

// 更新文章状态（审核功能）
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, reviewedBy, rejectionReason } = body;

    if (!id || !status || !reviewedBy) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const connection = await createConnection();
    const now = new Date();
    
    // 根据状态更新文章
    let query = '';
    let params: unknown[] = [];
    
    if (status === 'published') {
      // 审核通过
      query = `UPDATE post SET status = ?, reviewedBy = ?, reviewedAt = ?, rejectionReason = NULL, updatedAt = ? WHERE id = ?`;
      params = [status, reviewedBy, now, now, id];
    } else if (status === 'rejected') {
      // 审核不通过
      if (!rejectionReason) {
        return NextResponse.json({ error: '拒绝原因不能为空' }, { status: 400 });
      }
      query = `UPDATE post SET status = ?, reviewedBy = ?, reviewedAt = ?, rejectionReason = ?, updatedAt = ? WHERE id = ?`;
      params = [status, reviewedBy, now, rejectionReason, now, id];
    } else {
      return NextResponse.json({ error: '无效的状态' }, { status: 400 });
    }
    
    const [result] = await connection.execute(query, params);
    
    if ((result as unknown).affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    
    // 获取更新后的文章
    const [updatedPostRows] = await connection.execute(
      `SELECT 
        p.id, p.title, p.excerpt, p.content, p.image, p.readTime, 
        p.authorId, p.categoryId, p.status, p.foundSensitiveWords, p.reviewedBy, p.reviewedAt, p.rejectionReason, p.createdAt, p.updatedAt,
        u.name as authorName, u.avatar as authorAvatar,
        c.name as categoryName, c.slug as categorySlug
      FROM post p
      LEFT JOIN user u ON p.authorId = u.id
      LEFT JOIN category c ON p.categoryId = c.id
      WHERE p.id = ?`,
      [id]
    );
    
    await connection.end();
    
    const updatedPost = (updatedPostRows as unknown)[0];
    
    // 转换数据格式
    const formattedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      image: updatedPost.image,
      readTime: updatedPost.readTime,
      authorId: updatedPost.authorId,
      categoryId: updatedPost.categoryId,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
      status: updatedPost.status as 'published' | 'pending' | 'rejected',
      foundSensitiveWords: updatedPost.foundSensitiveWords ? JSON.parse(updatedPost.foundSensitiveWords) : [],
      reviewedBy: updatedPost.reviewedBy,
      reviewedAt: updatedPost.reviewedAt,
      rejectionReason: updatedPost.rejectionReason,
      likes: 0,
      author: {
        id: updatedPost.authorId,
        name: updatedPost.authorName,
        avatar: updatedPost.authorAvatar
      },
      category: {
        id: updatedPost.categoryId,
        name: updatedPost.categoryName,
        slug: updatedPost.categorySlug
      },
      comments: []
    };
    
    return NextResponse.json(formattedPost, { status: 200 });
  } catch (error) {
    console.error('更新文章状态失败:', error);
    return NextResponse.json({ error: '更新文章状态失败' }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = parseInt(searchParams.get('id') || '0');

    if (!postId) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const connection = await createConnection();
    const [result] = await connection.execute('DELETE FROM post WHERE id = ?', [postId]);
    await connection.end();
    
    if ((result as unknown).affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 });
  }
}