// 查询特定用户的密码信息
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

async function queryUserPassword() {
  try {
    console.log('正在查询用户密码信息...');
    
    // 获取数据库连接
    const connection = await pool.getConnection();
    
    try {
      // 查询特定用户的密码信息
      const [users] = await connection.execute(
        'SELECT id, name, email, usernameId, password, createdAt FROM user WHERE id = 7 OR email = ?',
        ['kxyatxy116@163.com']
      );
      
      if (users.length > 0) {
        console.log('\n=== 用户密码信息 ===');
        users.forEach(user => {
          console.log(`\n用户ID: ${user.id}`);
          console.log(`用户名: ${user.name}`);
          console.log(`用户名ID: ${user.usernameId}`);
          console.log(`邮箱: ${user.email}`);
          console.log(`注册时间: ${new Date(user.createdAt).toLocaleString()}`);
          console.log(`密码(加密后): ${user.password}`);
          console.log(`密码长度: ${user.password.length} 字符`);
          console.log(`密码类型: ${user.password.startsWith('$2b$') ? 'bcrypt加密' : '其他加密方式'}`);
        });
      } else {
        console.log('\n未找到匹配的用户');
      }
      
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
queryUserPassword();