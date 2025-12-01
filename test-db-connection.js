const mysql = require('mysql2/promise');

async function testDbConnection() {
  try {
    console.log('测试数据库连接...');
    
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'yueblog'
    });
    
    console.log('✅ 数据库连接成功！');
    
    // 测试查询操作
    console.log('\n测试查询操作...');
    const [rows] = await connection.execute('SELECT * FROM User LIMIT 5');
    console.log('✅ 查询操作成功！');
    console.log('查询结果:', rows);
    
    // 测试插入操作
    console.log('\n测试插入操作...');
    const [insertResult] = await connection.execute(
      'INSERT INTO User (name, email, password, avatar, bio, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['测试用户', 'test@example.com', 'password123', 'https://via.placeholder.com/100', '这是一个测试用户', 'user']
    );
    console.log('✅ 插入操作成功！');
    console.log('插入结果:', insertResult);
    
    // 测试更新操作
    console.log('\n测试更新操作...');
    const insertId = insertResult.insertId;
    const [updateResult] = await connection.execute(
      'UPDATE User SET name = ?, updatedAt = NOW() WHERE id = ?',
      ['更新后的测试用户', insertId]
    );
    console.log('✅ 更新操作成功！');
    console.log('更新结果:', updateResult);
    
    // 测试删除操作
    console.log('\n测试删除操作...');
    const [deleteResult] = await connection.execute(
      'DELETE FROM User WHERE id = ?',
      [insertId]
    );
    console.log('✅ 删除操作成功！');
    console.log('删除结果:', deleteResult);
    
    // 关闭数据库连接
    await connection.end();
    console.log('\n✅ 数据库连接已关闭！');
    console.log('\n🎉 所有数据库操作测试通过！');
    
    return true;
  } catch (error) {
    console.error('❌ 数据库操作失败:', error);
    return false;
  }
}

testDbConnection();