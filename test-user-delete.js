const axios = require('axios');

// 测试用户删除功能
async function testUserDelete() {
  console.log('🚀 开始测试用户删除功能...');
  
  try {
    // 1. 首先获取所有用户，查看当前用户列表
    console.log('📋 获取当前用户列表...');
    const usersResponse = await axios.get('http://localhost:3000/api/users');
    const initialUsers = usersResponse.data;
    console.log(`✅ 当前用户数量: ${initialUsers.length}`);
    console.log('📋 用户列表:');
    initialUsers.forEach(user => {
      console.log(`   - ID: ${user.id}, 姓名: ${user.name}, 邮箱: ${user.email}, 角色: ${user.role}`);
    });
    
    // 2. 如果没有用户，先创建一个测试用户
    let testUserId;
    if (initialUsers.length === 0) {
      console.log('📤 创建测试用户...');
      const createResponse = await axios.post('http://localhost:3000/api/users', {
        name: '测试用户',
        email: 'test@example.com',
        password: 'password123',
        usernameId: 'testuser'
      });
      testUserId = createResponse.data.id;
      console.log(`✅ 测试用户创建成功，ID: ${testUserId}`);
    } else {
      // 使用第一个用户作为测试用户
      testUserId = initialUsers[0].id;
      console.log(`📋 使用现有用户作为测试用户，ID: ${testUserId}`);
    }
    
    // 3. 测试删除用户（带删除博文选项）
    console.log(`🗑️ 删除用户 ${testUserId}（同时删除关联博文）...`);
    const deleteResponse = await axios.delete(`http://localhost:3000/api/users/${testUserId}`, {
      data: { deletePosts: true }
    });
    console.log(`✅ 用户删除成功，响应:`, deleteResponse.data);
    
    // 4. 验证用户已被删除
    console.log('🔍 验证用户已被删除...');
    const finalUsersResponse = await axios.get('http://localhost:3000/api/users');
    const finalUsers = finalUsersResponse.data;
    console.log(`✅ 删除后用户数量: ${finalUsers.length}`);
    
    const userStillExists = finalUsers.some(user => user.id === testUserId);
    if (!userStillExists) {
      console.log('✅ 测试通过: 用户已成功删除');
    } else {
      console.error('❌ 测试失败: 用户仍存在');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

testUserDelete();
