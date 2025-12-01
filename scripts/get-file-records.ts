import { PrismaClient } from '@prisma/client';
import { statSync, existsSync } from 'fs';
import { join } from 'path';

// 创建Prisma客户端
const prisma = new PrismaClient();

// 获取文件元数据
const getFileMetadata = (fileUrl: string) => {
  try {
    // 转换文件URL为本地文件路径
    const filename = fileUrl.split('/').pop();
    if (!filename) return null;
    
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    
    // 检查文件是否存在
    if (!existsSync(filePath)) return null;
    
    // 获取文件元数据
    const stats = statSync(filePath);
    
    return {
      filename,
      fileUrl,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      filePath,
      type: filename.split('.').pop() || 'unknown'
    };
  } catch (error) {
    console.error(`获取文件元数据失败: ${fileUrl}`, error);
    return null;
  }
};

// 主函数
const main = async () => {
  try {
    console.log('开始查询数据库中的文件记录...');
    
    // 查询所有用户，获取avatar和backgroundImage
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        backgroundImage: true
      }
    });
    
    // 查询所有文章，获取image
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        image: true
      }
    });
    
    // 定义类型
interface User {
  id: number;
  name: string;
  avatar: string | null;
  backgroundImage: string | null;
}

interface Post {
  id: number;
  title: string;
  image: string | null;
}

// 收集所有文件URL
const fileUrls = new Set<string>();

// 添加用户头像
users.forEach((user: User) => {
  if (user.avatar) fileUrls.add(user.avatar);
  if (user.backgroundImage) fileUrls.add(user.backgroundImage);
});

// 添加文章图片
posts.forEach((post: Post) => {
  if (post.image) fileUrls.add(post.image);
});

// 获取每个文件的元数据
const fileRecords = Array.from(fileUrls)
  .map(getFileMetadata)
  .filter((file): file is NonNullable<ReturnType<typeof getFileMetadata>> => file !== null);

// 输出结果
console.log('\n=== 数据库中的文件记录 ===');
console.log(`共找到 ${fileRecords.length} 个文件记录\n`);

if (fileRecords.length > 0) {
  // 格式化输出
  console.log('文件ID | 文件名 | 文件URL | 文件大小 | 创建时间 | 修改时间 | 文件路径 | 文件类型');
  console.log('-'.repeat(150));
  
  fileRecords.forEach((file, index) => {
    console.log(`${index + 1} | ${file.filename} | ${file.fileUrl} | ${file.size} bytes | ${file.createdAt.toISOString()} | ${file.modifiedAt.toISOString()} | ${file.filePath} | ${file.type}`);
  });
} else {
  console.log('没有找到文件记录');
}
    
    // 关闭Prisma客户端
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('查询文件记录失败:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// 执行主函数
main();
