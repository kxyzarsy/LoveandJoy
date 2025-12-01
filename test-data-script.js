#!/usr/bin/env node

/**
 * 测试数据生成脚本
 * 用于向数据库插入各种类型的测试数据，验证数据一致性
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 生成随机字符串
 * @param {number} length 字符串长度
 * @returns {string} 随机字符串
 */
function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成随机日期
 * @param {Date} start 开始日期
 * @param {Date} end 结束日期
 * @returns {Date} 随机日期
 */
function generateRandomDate(start = new Date(2020, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * 生成测试数据
 */
async function generateTestData() {
  console.log('🚀 开始生成测试数据...');
  
  try {
    // 1. 创建测试分类
    console.log('📁 创建测试分类...');
    const categories = await prisma.category.createMany({
      data: [
        { name: '技术', slug: 'tech' },
        { name: '生活', slug: 'life' },
        { name: '旅行', slug: 'travel' },
        { name: '美食', slug: 'food' },
        { name: '阅读', slug: 'reading' }
      ],
      skipDuplicates: true
    });
    console.log(`✅ 创建了 ${categories.count} 个分类`);
    
    // 2. 创建测试用户
    console.log('👤 创建测试用户...');
    const users = await prisma.user.createMany({
      data: [
        { 
          name: '测试用户1', 
          email: 'test1@example.com', 
          password: 'password123' 
        },
        { 
          name: '测试用户2', 
          email: 'test2@example.com', 
          password: 'password123' 
        },
        { 
          name: '测试用户3', 
          email: 'test3@example.com', 
          password: 'password123' 
        }
      ],
      skipDuplicates: true
    });
    console.log(`✅ 创建了 ${users.count} 个用户`);
    
    // 获取实际的用户和分类数据
    const actualUsers = await prisma.user.findMany();
    const actualCategories = await prisma.category.findMany();
    
    // 3. 创建测试文章（覆盖不同数据类型和边界条件）
    console.log('📝 创建测试文章...');
    
    // 测试数据数组
    const testPosts = [
      // 正常文章
      {
        title: '正常测试文章',
        excerpt: '这是一篇正常的测试文章摘要',
        content: '<h1>正常测试文章</h1><p>这是一篇包含正常内容的测试文章，用于验证数据一致性。</p>',
        authorId: actualUsers[0].id,
        categoryId: actualCategories[0].id,
        readTime: 5
      },
      // 空值测试
      {
        title: '空值测试文章',
        excerpt: '', // 空摘要
        content: '<p>这篇文章的摘要是空的，用于测试空值处理。</p>',
        authorId: actualUsers[1].id,
        categoryId: actualCategories[1].id,
        readTime: null // 空阅读时间
      },
      // 长文本测试
      {
        title: '长标题测试文章'.repeat(5), // 长标题
        excerpt: '长摘要测试'.repeat(10), // 长摘要
        content: '<p>长内容测试</p>'.repeat(100), // 长内容
        authorId: actualUsers[2].id,
        categoryId: actualCategories[2].id,
        readTime: 10
      },
      // 特殊字符测试
      {
        title: '特殊字符测试文章：!@#$%^&*()_+-=[]{}|;:,.<>?',
        excerpt: '特殊字符摘要：\'"\\/`~',
        content: '<p>特殊字符内容：©®™€£¥</p>',
        authorId: actualUsers[0].id,
        categoryId: actualCategories[3].id,
        readTime: 3
      },
      // 数字边界测试
      {
        title: '数字边界测试文章',
        excerpt: '测试数字边界',
        content: '<p>这篇文章用于测试数字边界条件。</p>',
        authorId: actualUsers[1].id,
        categoryId: actualCategories[4].id,
        readTime: 0 // 最小值
      }
    ];
    
    // 插入测试文章
    for (const postData of testPosts) {
      await prisma.post.create({
        data: {
          ...postData,
          createdAt: generateRandomDate(),
          updatedAt: generateRandomDate()
        }
      });
    }
    console.log(`✅ 创建了 ${testPosts.length} 篇测试文章`);
    
    // 4. 创建测试评论
    console.log('💬 创建测试评论...');
    const posts = await prisma.post.findMany();
    
    // 测试评论数据
    const testComments = [
      // 正常评论
      {
        content: '这是一条正常的测试评论',
        authorId: actualUsers[0].id,
        postId: posts[0].id
      },
      // 回复评论
      {
        content: '这是对第一条评论的回复',
        authorId: actualUsers[1].id,
        postId: posts[0].id,
        parentId: null // 先创建顶级评论，稍后更新为回复
      },
      // 空内容评论
      {
        content: '', // 空内容
        authorId: actualUsers[2].id,
        postId: posts[1].id
      },
      // 长评论
      {
        content: '长评论内容'.repeat(50), // 长评论
        authorId: actualUsers[0].id,
        postId: posts[2].id
      }
    ];
    
    // 插入测试评论
    const createdComments = [];
    for (const commentData of testComments) {
      const comment = await prisma.comment.create({
        data: {
          ...commentData,
          createdAt: generateRandomDate(),
          updatedAt: generateRandomDate()
        }
      });
      createdComments.push(comment);
    }
    
    // 更新第二条评论为第一条评论的回复
    if (createdComments.length >= 2) {
      await prisma.comment.update({
        where: { id: createdComments[1].id },
        data: { parentId: createdComments[0].id }
      });
    }
    
    console.log(`✅ 创建了 ${createdComments.length} 条测试评论`);
    
    // 5. 验证数据完整性
    console.log('🔍 验证数据完整性...');
    
    const totalUsers = await prisma.user.count();
    const totalCategories = await prisma.category.count();
    const totalPosts = await prisma.post.count();
    const totalComments = await prisma.comment.count();
    
    console.log(`📊 数据统计：`);
    console.log(`   用户总数：${totalUsers}`);
    console.log(`   分类总数：${totalCategories}`);
    console.log(`   文章总数：${totalPosts}`);
    console.log(`   评论总数：${totalComments}`);
    
    console.log('🎉 测试数据生成完成！');
    
  } catch (error) {
    console.error('❌ 生成测试数据失败：', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行测试数据生成
generateTestData();
