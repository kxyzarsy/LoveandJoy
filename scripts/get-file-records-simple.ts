import { statSync, existsSync } from 'fs';
import { join } from 'path';

// 直接使用查询结果
const userData = [
  {
    id: 1,
    name: '管理员',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
  }
];

const postData = [
  {
    id: 1,
    title: 'Next.js 16 新特性介绍',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    title: '如何保持健康的生活方式',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    title: '高效学习方法分享',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop'
  }
];

// 获取文件元数据
const getFileMetadata = (fileUrl: string) => {
  try {
    // 检查是否为外部URL
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return {
        filename: fileUrl.split('/').pop() || 'external-file',
        fileUrl,
        size: 0, // 外部文件无法获取大小
        createdAt: new Date(), // 外部文件无法获取创建时间
        modifiedAt: new Date(), // 外部文件无法获取修改时间
        filePath: 'external',
        type: fileUrl.split('.').pop() || 'unknown',
        isExternal: true
      };
    }
    
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
      type: filename.split('.').pop() || 'unknown',
      isExternal: false
    };
  } catch (error) {
    console.error(`获取文件元数据失败: ${fileUrl}`, error);
    return null;
  }
};

// 主函数
const main = () => {
  try {
    console.log('开始查询数据库中的文件记录...');
    
    // 收集所有文件URL
    const fileUrls = new Set<string>();
    
    // 添加用户头像和背景图片
    userData.forEach(user => {
      if (user.avatar) fileUrls.add(user.avatar);
      if (user.backgroundImage) fileUrls.add(user.backgroundImage);
    });
    
    // 添加文章图片
    postData.forEach(post => {
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
      console.log('文件ID | 文件名 | 文件URL | 文件大小 | 创建时间 | 修改时间 | 文件路径 | 文件类型 | 是否外部资源');
      console.log('-'.repeat(200));
      
      fileRecords.forEach((file, index) => {
        console.log(`${index + 1} | ${file.filename} | ${file.fileUrl} | ${file.size} bytes | ${file.createdAt.toISOString()} | ${file.modifiedAt.toISOString()} | ${file.filePath} | ${file.type} | ${file.isExternal ? '是' : '否'}`);
      });
    } else {
      console.log('没有找到文件记录');
    }
    
  } catch (error) {
    console.error('查询文件记录失败:', error);
    process.exit(1);
  }
};

// 执行主函数
main();
