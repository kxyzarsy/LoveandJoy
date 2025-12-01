// 查询数据库中的文章和用户数据
const { PrismaClient } = require('./src/generated/prisma/client');

// 设置环境变量
env = {
  DATABASE_URL: "mysql://root:123456@localhost:3306/myblog"
};

async function queryDatabase() {
  try {
    // 初始化PrismaClient
    const prisma = new PrismaClient();
    
    console.log('正在查询数据库...');
    
    // 查询所有文章
    console.log('\n=== 文章数据 ===');
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`共找到 ${posts.length} 篇文章:`);
    posts.forEach(post => {
      console.log(`\n文章ID: ${post.id}`);
      console.log(`标题: ${post.title}`);
      console.log(`作者: ${post.author.name}`);
      console.log(`分类: ${post.category.name}`);
      console.log(`创建时间: ${new Date(post.createdAt).toLocaleString()}`);
      console.log(`状态: ${post.status}`);
      console.log(`阅读量: ${post.readTime || 0}`);
    });
    
    // 查询所有用户
    console.log('\n\n=== 用户数据 ===');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        usernameId: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`共找到 ${users.length} 个用户:`);
    users.forEach(user => {
      console.log(`\n用户ID: ${user.id}`);
      console.log(`用户名: ${user.name}`);
      console.log(`用户名ID: ${user.usernameId}`);
      console.log(`邮箱: ${user.email}`);
      console.log(`注册时间: ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`简介: ${user.bio || '无'}`);
    });
    
    // 查询分类数据
    console.log('\n\n=== 分类数据 ===');
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`共找到 ${categories.length} 个分类:`);
    categories.forEach(category => {
      console.log(`\n分类ID: ${category.id}`);
      console.log(`分类名称: ${category.name}`);
      console.log(`分类Slug: ${category.slug}`);
      console.log(`文章数量: ${category._count.posts}`);
    });
    
    // 关闭PrismaClient连接
    await prisma.$disconnect();
    
    console.log('\n\n=== 查询完成 ===');
  } catch (error) {
    console.error('查询数据库失败:', error);
    process.exit(1);
  }
}

// 执行查询
queryDatabase();
