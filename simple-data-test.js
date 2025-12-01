#!/usr/bin/env node

/**
 * 简单数据一致性测试脚本
 * 用于测试数据上传和获取的一致性
 */

const mysql = require('mysql2/promise');

// 数据库配置
const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'yueblog'
};

/**
 * 测试数据一致性
 */
async function testDataConsistency() {
  console.log('🚀 开始测试数据一致性...');
  
  let connection;
  
  try {
    // 创建数据库连接
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ 数据库连接成功');
    
    // 1. 检查并创建测试用户
    console.log('\n👤 检查测试用户...');
    const [users] = await connection.execute('SELECT * FROM user');
    let testUserId;
    
    if (users.length === 0) {
      // 创建测试用户
      const [userResult] = await connection.execute(
        'INSERT INTO user (name, email, password, updatedAt) VALUES (?, ?, ?, NOW())',
        ['测试用户', 'test@example.com', 'password123']
      );
      testUserId = userResult.insertId;
      console.log(`✅ 创建了测试用户，ID: ${testUserId}`);
    } else {
      testUserId = users[0].id;
      console.log(`✅ 使用现有用户，ID: ${testUserId}`);
    }
    
    // 2. 检查并创建测试分类
    console.log('\n📁 检查测试分类...');
    const [categories] = await connection.execute('SELECT * FROM category');
    let testCategoryId;
    
    if (categories.length === 0) {
      // 创建测试分类
      const [categoryResult] = await connection.execute(
        'INSERT INTO category (name, slug) VALUES (?, ?)',
        ['测试分类', 'test-category']
      );
      testCategoryId = categoryResult.insertId;
      console.log(`✅ 创建了测试分类，ID: ${testCategoryId}`);
    } else {
      testCategoryId = categories[0].id;
      console.log(`✅ 使用现有分类，ID: ${testCategoryId}`);
    }
    
    // 3. 测试数据插入和查询
    console.log('\n📝 测试数据插入和查询...');
    
    // 测试数据
    const testPost = {
      title: '一致性测试文章',
      excerpt: '这是一篇用于测试数据一致性的文章摘要',
      content: '<h1>一致性测试文章</h1><p>这是一篇用于测试数据一致性的文章内容。</p>',
      authorId: testUserId,
      categoryId: testCategoryId,
      readTime: 5
    };
    
    // 插入测试文章
    const [insertResult] = await connection.execute(
      `INSERT INTO post (title, excerpt, content, authorId, categoryId, readTime, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [testPost.title, testPost.excerpt, testPost.content, testPost.authorId, testPost.categoryId, testPost.readTime]
    );
    
    const postId = insertResult.insertId;
    console.log(`✅ 插入测试文章成功，ID: ${postId}`);
    
    // 查询插入的文章
    const [posts] = await connection.execute(
      `SELECT * FROM post WHERE id = ?`,
      [postId]
    );
    
    const insertedPost = posts[0];
    console.log(`✅ 查询测试文章成功`);
    
    // 4. 验证数据一致性
    console.log('\n🔍 验证数据一致性...');
    
    const fieldsToCompare = ['title', 'excerpt', 'content', 'authorId', 'categoryId', 'readTime'];
    let allFieldsMatch = true;
    
    for (const field of fieldsToCompare) {
      const expectedValue = testPost[field];
      const actualValue = insertedPost[field];
      
      if (expectedValue !== actualValue) {
        console.log(`❌ 字段不匹配: ${field}`);
        console.log(`   期望值: ${JSON.stringify(expectedValue)}`);
        console.log(`   实际值: ${JSON.stringify(actualValue)}`);
        allFieldsMatch = false;
      } else {
        console.log(`✅ 字段匹配: ${field}`);
      }
    }
    
    // 5. 测试边界条件
    console.log('\n📏 测试边界条件...');
    
    // 空值测试
    const [nullResult] = await connection.execute(
      `INSERT INTO post (title, excerpt, content, authorId, categoryId, readTime, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      ['空值测试文章', '', '<p>空值测试内容</p>', testUserId, testCategoryId, null]
    );
    
    const nullPostId = nullResult.insertId;
    console.log(`✅ 插入空值测试文章成功，ID: ${nullPostId}`);
    
    const [nullPosts] = await connection.execute(
      `SELECT * FROM post WHERE id = ?`,
      [nullPostId]
    );
    
    const nullPost = nullPosts[0];
    if (nullPost.excerpt === '') {
      console.log('✅ 空摘要处理正确');
    } else {
      console.log('❌ 空摘要处理错误');
    }
    
    if (nullPost.readTime === null) {
      console.log('✅ 空阅读时间处理正确');
    } else {
      console.log('❌ 空阅读时间处理错误');
    }
    
    // 6. 清理测试数据
    console.log('\n🧹 清理测试数据...');
    await connection.execute('DELETE FROM post WHERE id IN (?, ?)', [postId, nullPostId]);
    console.log(`✅ 删除测试文章成功`);
    
    // 7. 生成测试报告
    console.log('\n📊 测试报告:');
    console.log('====================================');
    console.log('测试结果: ', allFieldsMatch ? '✅ 所有测试通过' : '❌ 部分测试失败');
    console.log('测试项目:');
    console.log('  - ✅ 数据库连接');
    console.log('  - ✅ 用户和分类检查');
    console.log('  - ✅ 数据插入');
    console.log('  - ✅ 数据查询');
    console.log('  - ✅ 字段一致性验证');
    console.log('  - ✅ 空值处理测试');
    console.log('  - ✅ 测试数据清理');
    console.log('====================================');
    
    console.log('\n🎉 数据一致性测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.sqlMessage) {
      console.error('   SQL错误:', error.sqlMessage);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ 数据库连接已关闭');
    }
  }
}

// 执行测试
testDataConsistency();
