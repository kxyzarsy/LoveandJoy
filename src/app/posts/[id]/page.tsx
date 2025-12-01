'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

// 文章类型定义
interface Post {
  id: number
  title: string
  excerpt: string
  content: string
  categoryId: number
  image: string
  status: 'published' | 'pending' | 'rejected'
  foundSensitiveWords: string[]
  createdAt: string
  authorId: number
  reviewedBy: number | null
  reviewedAt: string | null
  rejectionReason: string | null
  likes: number // 点赞数
  category?: { name: string; slug: string }
  author?: { name: string }
}

// 分类类型定义
interface Category {
  id: number
  name: string
  slug: string
}

// 用户类型定义
interface User {
  id: number
  name: string
}

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {  
  // 使用React.use()解包params Promise
  const resolvedParams = use(params)
  const postId = parseInt(resolvedParams.id)
  
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // 从API获取文章数据
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const postsData: Post[] = await response.json()
        
        // 为文章添加默认值
        const processedPosts = postsData.map(post => ({
          ...post,
          status: post.status || 'published',
          likes: post.likes || 0
        }))
        
        const foundPost = processedPosts.find(p => p.id === postId)
        
        if (foundPost) {
          setPost(foundPost)
        } else {
          setError('文章不存在')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('加载文章失败')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPost()
  }, [postId])

  // 点赞功能
  const handleLike = async () => {
    if (post) {
      try {
        // 从API获取最新文章数据
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const postsData: Post[] = await response.json()
        
        // 更新文章点赞数
        const updatedPosts = postsData.map(p => {
          if (p.id === post.id) {
            return { ...p, likes: p.likes + 1 }
          }
          return p
        })
        
        // 保存到全局变量（实际项目中应调用API更新）
        // 这里我们直接更新状态，因为API使用的是全局变量
        setPost({ ...post, likes: post.likes + 1 })
      } catch (error) {
        console.error('Error updating likes:', error)
      }
    }
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 错误状态
  if (error || !post) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || '文章不存在'}</h2>
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          返回首页
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 文章头部 */}
      <article className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 文章图片 */}
        {post.image && (
          <div className="relative h-80 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Link 
                href={`/categories/${post.category?.slug || 'uncategorized'}`} 
                className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {post.category?.name || '未分类'}
              </Link>
            </div>
          </div>
        )}
        
        {/* 文章内容 */}
        <div className="p-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {post.author?.name || '未知作者'}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
          
          <div className="text-gray-700 mb-8 whitespace-pre-wrap">
            {post.content}
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button 
              onClick={handleLike}
              className="inline-flex items-center text-gray-500 hover:text-red-600 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{post.likes} 点赞</span>
            </button>
            
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              返回首页
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
      
      {/* 相关文章 */}
      <section className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">相关文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 这里可以添加相关文章逻辑 */}
          {/* 暂时显示返回首页按钮 */}
          <div className="col-span-full text-center py-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              查看更多文章
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}