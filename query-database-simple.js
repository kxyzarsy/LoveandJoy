// 查询数据库中的文章和用户数据
const mysql = require('mysql2/promise');

// 数据库连接配置
const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'yueblog',
  connectionLimit: 10
};

// 创建数据库连接池
const pool = mysql.createPool(DB_CONFIG);

async function queryDatabase() {
  try {
    console.log('正在查询数据库...');
    
    // 获取数据库连接
    const connection = await pool.getConnection();
    
    try {
      // 查询所有文章
      console.log('\n=== 文章数据 ===');
      const [posts] = await connection.execute(
        'SELECT p.id, p.title, p.excerpt, p.content, p.image, p.readTime, p.createdAt, p.updatedAt, ' +
        'u.id as authorId, u.name as authorName, u.email as authorEmail, u.avatar as authorAvatar, ' +
        'c.id as categoryId, c.name as categoryName, c.slug as categorySlug ' +
        'FROM post p ' +
        'JOIN user u ON p.authorId = u.id ' +
        'JOIN category c ON p.categoryId = c.id ' +
        'ORDER BY p.createdAt DESC'
      );
      
      console.log(`共找到 ${posts.length} 篇文章:`);
      posts.forEach(post => {
        console.log(`\n文章ID: ${post.id}`);
        console.log(`标题: ${post.title}`);
        console.log(`作者: ${post.authorName}`);
        console.log(`分类: ${post.categoryName}`);
        console.log(`创建时间: ${new Date(post.createdAt).toLocaleString()}`);
        console.log(`阅读时间: ${post.readTime || 0} 分钟`);
      });
      
      // 查询所有用户
      console.log('\n\n=== 用户数据 ===');
      const [users] = await connection.execute(
        'SELECT id, name, email, usernameId, avatar, bio, createdAt, updatedAt FROM user ORDER BY createdAt DESC'
      );
      
      console.log(`共找到 ${users.length} 个用户:`);
      users.forEach(user => {
        console.log(`\n用户ID: ${user.id}`);
        console.log(`用户名: ${user.name}`);
        console.log(`用户名ID: ${user.usernameId}`);
        console.log(`邮箱: ${user.email}`);
        console.log(`注册时间: ${new Date(user.createdAt).toLocaleString()}`);
        console.log(`简介: ${user.bio || '无'}`);
      });
      
      // 查询所有分类
      console.log('\n\n=== 分类数据 ===');
      const [categories] = await connection.execute(
        'SELECT c.id, c.name, c.slug, COUNT(p.id) as postCount ' +
        'FROM category c ' +
        'LEFT JOIN post p ON c.id = p.categoryId ' +
        'GROUP BY c.id, c.name, c.slug ' +
        'ORDER BY c.name ASC'
      );
      
      console.log(`共找到 ${categories.length} 个分类:`);
      categories.forEach(category => {
        console.log(`\n分类ID: ${category.id}`);
        console.log(`分类名称: ${category.name}`);
        console.log(`分类Slug: ${category.slug}`);
        console.log(`文章数量: ${category.postCount}`);
      });
      
      // 查询登录日志
      console.log('\n\n=== 登录日志 ===');
      const [loginLogs] = await connection.execute(
        'SELECT id, username, ipAddress, userAgent, isSuccess, errorMessage, createdAt ' +
        'FROM loginLog ' +
        'ORDER BY createdAt DESC ' +
        'LIMIT 10'
      );
      
      console.log(`共找到 ${loginLogs.length} 条登录日志 (仅显示最近10条):`);
      loginLogs.forEach(log => {
        console.log(`\n日志ID: ${log.id}`);
        console.log(`用户名: ${log.username}`);
        console.log(`IP地址: ${log.ipAddress}`);
        console.log(`登录状态: ${log.isSuccess ? '成功' : '失败'}`);
        if (!log.isSuccess) {
          console.log(`错误信息: ${log.errorMessage || '无'}`);
        }
        console.log(`登录时间: ${new Date(log.createdAt).toLocaleString()}`);
      });
      
    } finally {
      // 释放数据库连接
      connection.release();
    }
    
    console.log('\n\n=== 查询完成 ===');
  } catch (error) {
    console.error('查询数据库失败:', error);
    process.exit(1);
  } finally {
    // 关闭连接池
    await pool.end();
  }
}

// 执行查询
queryDatabase();