// 测试 API 和数据库连接的脚本
const mysql = require('mysql2/promise');
const fetch = require('node-fetch');

async function testApiDb() {
  console.log('📊 开始测试 API 和数据库连接...');
  
  // 测试数据库连接
  console.log('\n📌 测试1：数据库连接');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'yueblog'
    });
    console.log('✅ 数据库连接成功！');
    
    // 测试查询操作
    console.log('\n📌 测试2：数据库查询操作');
    const [rows] = await connection.execute('SELECT * FROM User LIMIT 5');
    console.log(`✅ 查询成功！获取到 ${rows.length} 条用户记录`);
    console.log('查询结果:', rows);
    
    // 测试插入操作
    console.log('\n📌 测试3：数据库插入操作');
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const [insertResult] = await connection.execute(
      'INSERT INTO User (name, email, password, avatar, bio, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['测试用户', uniqueEmail, 'password123', 'https://via.placeholder.com/100', '这是一个测试用户', 'user']
    );
    console.log('✅ 插入成功！');
    console.log('插入结果:', insertResult);
    
    // 关闭数据库连接
    await connection.end();
    console.log('✅ 数据库连接已关闭！');
    
  } catch (error) {
    console.error('❌ 数据库测试失败:', error);
    return;
  }
  
  // 测试 API
  console.log('\n📌 测试4：API 测试');
  try {
    // 测试获取所有用户 API
    const usersResponse = await fetch('http://localhost:3000/api/users');
    const usersData = await usersResponse.json();
    console.log(`✅ 获取所有用户 API 成功！状态码: ${usersResponse.status}`);
    console.log(`   返回 ${usersData.length} 条用户记录`);
    console.log('   数据示例:', usersData[0]);
    
    // 测试获取单个用户 API（使用第一条记录的 ID）
    if (usersData.length > 0) {
      const userId = usersData[0].id;
      const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`);
      const userData = await userResponse.json();
      console.log(`✅ 获取单个用户 API 成功！状态码: ${userResponse.status}`);
      console.log('   用户数据:', userData);
    }
    
  } catch (error) {
    console.error('❌ API 测试失败:', error);
    return;
  }
  
  console.log('\n🎉 所有测试通过！API 和数据库连接正常。');
}

// 运行测试
testApiDb();