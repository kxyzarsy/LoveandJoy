// 测试用户管理 API 的脚本（使用 axios）
const axios = require('axios');

async function testUserApi() {
  console.log('📊 开始测试用户管理 API...');
  
  // 测试获取所有用户 API
  console.log('\n📌 测试1：获取所有用户 API');
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    
    console.log(`✅ 响应状态码: ${response.status}`);
    console.log(`✅ 返回 ${response.data.length} 条用户记录`);
    console.log('用户数据:', response.data);
    
  } catch (error) {
    console.error('❌ 获取所有用户 API 测试失败:', error.response?.data || error.message);
  }
  
  // 测试获取单个用户 API
  console.log('\n📌 测试2：获取单个用户 API');
  try {
    const response = await axios.get('http://localhost:3000/api/users/1');
    
    console.log(`✅ 响应状态码: ${response.status}`);
    console.log('用户数据:', response.data);
    
  } catch (error) {
    console.error('❌ 获取单个用户 API 测试失败:', error.response?.data || error.message);
  }
  
  // 测试创建用户 API
  console.log('\n📌 测试3：创建用户 API');
  try {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const response = await axios.post('http://localhost:3000/api/users', {
      name: '测试用户',
      email: uniqueEmail,
      password: 'password123',
      avatar: 'https://via.placeholder.com/100',
      bio: '这是一个测试用户'
    });
    
    console.log(`✅ 响应状态码: ${response.status}`);
    console.log('创建的用户数据:', response.data);
    
  } catch (error) {
    console.error('❌ 创建用户 API 测试失败:', error.response?.data || error.message);
  }
  
  console.log('\n📋 测试完成！');
}

// 运行测试
testUserApi();