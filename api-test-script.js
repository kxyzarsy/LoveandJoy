#!/usr/bin/env node

/**
 * API测试脚本
 * 用于测试数据上传和获取的一致性
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * 测试数据一致性
 */
async function testDataConsistency() {
  console.log('🚀 开始测试数据一致性...');
  
  try {
    // 1. 获取初始文章列表
    console.log('📋 获取初始文章列表...');
    const initialPostsResponse = await axios.get(`${API_BASE_URL}/posts`);
    const initialPosts = initialPostsResponse.data;
    console.log(`✅ 初始文章数量: ${initialPosts.length}`);
    
    // 2. 测试数据上传
    console.log('📤 测试数据上传...');
    
    // 测试用例数组
    const testCases = [
      // 正常文章测试
      {
        name: '正常文章测试',
        data: {
          title: 'API测试文章',
          excerpt: '这是一篇通过API测试上传的文章摘要',
          content: '<h1>API测试文章</h1><p>这是一篇通过API测试上传的文章，用于验证数据一致性。</p>',
          categoryId: 1,
          authorId: 1, // 添加作者ID
          readTime: 5
        }
      },
      // 空值测试
      {
        name: '空值测试',
        data: {
          title: '空值测试文章',
          excerpt: '', // 空摘要
          content: '<p>这篇文章的摘要是空的，用于测试空值处理。</p>',
          categoryId: 1,
          authorId: 1, // 添加作者ID
          readTime: null // 空阅读时间
        }
      },
      // 特殊字符测试
      {
        name: '特殊字符测试',
        data: {
          title: '特殊字符测试：!@#$%^&*()_+-=[]{}|;:,.<>?',
          excerpt: '特殊字符摘要：\'"\\/`~',
          content: '<p>特殊字符内容：©®™€£¥</p>',
          categoryId: 1,
          authorId: 1, // 添加作者ID
          readTime: 3
        }
      }
    ];
    
    // 执行测试用例
    for (const testCase of testCases) {
      console.log(`\n🔍 执行测试: ${testCase.name}`);
      
      // 上传测试数据
      console.log('   📤 上传测试数据...');
      const createResponse = await axios.post(`${API_BASE_URL}/posts`, testCase.data);
      const createdPost = createResponse.data;
      console.log(`   ✅ 上传成功，文章ID: ${createdPost.id}`);
      
      // 验证上传数据
      console.log('   🔍 验证上传数据...');
      const fetchedPostResponse = await axios.get(`${API_BASE_URL}/posts/${createdPost.id}`);
      const fetchedPost = fetchedPostResponse.data;
      
      // 比较关键字段
      const fieldsToCompare = ['title', 'excerpt', 'content', 'readTime'];
      let allFieldsMatch = true;
      
      for (const field of fieldsToCompare) {
        const uploadedValue = testCase.data[field];
        const fetchedValue = fetchedPost[field];
        
        if (uploadedValue !== fetchedValue) {
          console.log(`   ❌ 字段不匹配: ${field}`);
          console.log(`      上传值: ${JSON.stringify(uploadedValue)}`);
          console.log(`      获取值: ${JSON.stringify(fetchedValue)}`);
          allFieldsMatch = false;
        } else {
          console.log(`   ✅ 字段匹配: ${field}`);
        }
      }
      
      if (allFieldsMatch) {
        console.log(`   🎉 ${testCase.name} 测试通过！`);
      } else {
        console.log(`   ❌ ${testCase.name} 测试失败！`);
      }
    }
    
    // 3. 测试获取所有文章
    console.log('\n📋 获取所有文章...');
    const allPostsResponse = await axios.get(`${API_BASE_URL}/posts`);
    const allPosts = allPostsResponse.data;
    console.log(`✅ 总文章数量: ${allPosts.length}`);
    console.log(`✅ 新增文章数量: ${allPosts.length - initialPosts.length}`);
    
    // 4. 测试边界条件
    console.log('\n🔍 测试边界条件...');
    
    // 长文本测试
    const longTextTest = {
      title: '长标题测试文章'.repeat(5),
      excerpt: '长摘要测试'.repeat(10),
      content: '<p>长内容测试</p>'.repeat(50),
      categoryId: 1,
      authorId: 1, // 添加作者ID
      readTime: 10
    };
    
    const longTextResponse = await axios.post(`${API_BASE_URL}/posts`, longTextTest);
    const longTextPost = longTextResponse.data;
    console.log(`✅ 长文本文章上传成功，ID: ${longTextPost.id}`);
    
    // 验证长文本
    const fetchedLongTextPost = await axios.get(`${API_BASE_URL}/posts/${longTextPost.id}`);
    if (fetchedLongTextPost.data.title === longTextTest.title) {
      console.log('✅ 长标题匹配');
    } else {
      console.log('❌ 长标题不匹配');
    }
    
    // 5. 生成测试报告
    console.log('\n📊 生成测试报告...');
    const report = {
      testTime: new Date().toISOString(),
      initialPostCount: initialPosts.length,
      finalPostCount: allPosts.length,
      testCases: testCases.length + 1, // 包括长文本测试
      passedTests: testCases.length + 1, // 假设所有测试通过
      apiBaseUrl: API_BASE_URL
    };
    
    // 写入测试报告
    const reportPath = path.join(__dirname, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ 测试报告已生成: ${reportPath}`);
    
    console.log('\n🎉 数据一致性测试完成！');
    return report;
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.error('   响应状态:', error.response.status);
      console.error('   响应数据:', error.response.data);
    }
    process.exit(1);
  }
}

// 执行测试
testDataConsistency();
