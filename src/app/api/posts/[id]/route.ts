import { NextResponse } from 'next/server';

// 使用模拟文章数据
const mockPosts = [
  {
    id: 1,
    title: '欢迎来到我的博客',
    excerpt: '这是我的第一篇博客文章，我将在这里分享我的生活和思考。',
    content: '<p>这是我的第一篇博客文章，我将在这里分享我的生活和思考。</p><p>博客是一个很好的平台，可以记录自己的成长历程，分享自己的经验和见解，与他人交流和学习。</p>',
    createdAt: new Date(),
    readTime: 5,
    author: { id: 1, name: '博主', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', bio: '热爱技术，喜欢分享。' },
    category: { id: 1, name: '生活', slug: 'life' },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    comments: [
      {
        id: 1,
        content: '这是一条评论',
        createdAt: new Date(),
        author: { name: '访客', avatar: 'https://via.placeholder.com/100' },
        replies: [
          {
            id: 2,
            content: '这是一条回复',
            createdAt: new Date(),
            author: { name: '博主', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Next.js 入门指南',
    excerpt: '学习如何使用 Next.js 创建现代化的 React 应用程序。',
    content: '<p>Next.js 是一个基于 React 的全栈框架，可以帮助你创建现代化的 Web 应用程序。</p><p>它提供了很多强大的功能，比如服务器端渲染、静态站点生成、API 路由等，让你可以轻松构建高性能的 Web 应用。</p>',
    createdAt: new Date(Date.now() - 86400000),
    readTime: 8,
    author: { id: 1, name: '博主', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', bio: '热爱技术，喜欢分享。' },
    category: { id: 2, name: '技术', slug: 'tech' },
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    comments: []
  },
  {
    id: 3,
    title: 'Tailwind CSS 实用技巧',
    excerpt: '掌握 Tailwind CSS 的高级用法，快速构建美观的 UI。',
    content: '<p>Tailwind CSS 是一个实用优先的 CSS 框架，可以帮助你快速构建美观的 UI。</p><p>它提供了大量的工具类，让你可以直接在 HTML 中编写样式，而不需要编写传统的 CSS 文件。</p>',
    createdAt: new Date(Date.now() - 172800000),
    readTime: 6,
    author: { id: 1, name: '博主', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', bio: '热爱技术，喜欢分享。' },
    category: { id: 2, name: '技术', slug: 'tech' },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    comments: []
  }
];

// 获取单个文章详情
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = mockPosts.find(p => p.id === parseInt(id));

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}