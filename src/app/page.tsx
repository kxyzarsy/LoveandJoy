'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createErrorResponse } from '../utils/error-handler'

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

export default function Home() {
  // 状态管理
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 从API获取文章数据
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      
      try {
        // 从API获取文章数据
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw response
        }
        let postsData: Post[] = await response.json()
        
        // 为没有点赞数的文章添加默认点赞数
        postsData = postsData.map(post => ({
          ...post,
          likes: post.likes || 0
        }))
        
        // 为没有状态的文章添加默认状态为已发布
        postsData = postsData.map(post => ({
          ...post,
          status: post.status || 'published'
        }))
        
        // 只显示已发布的文章
        postsData = postsData.filter(post => post.status === 'published')
        
        // 按点赞量降序排序
        postsData.sort((a, b) => b.likes - a.likes)
        
        setPosts(postsData)
        setError(null)
      } catch (error) {
        // 处理错误
        const errorMessage = error instanceof Error ? error.message : '获取文章失败'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    
    // 初始化获取数据
    fetchPosts()
    
    // 每天12点更新数据
    const now = new Date()
    const nextNoon = new Date(now)
    nextNoon.setHours(12, 0, 0, 0)
    if (now > nextNoon) {
      nextNoon.setDate(nextNoon.getDate() + 1)
    }
    const timeUntilNoon = nextNoon.getTime() - now.getTime()
    
    const updateInterval = setTimeout(() => {
      fetchPosts()
      // 之后每天更新一次
      setInterval(fetchPosts, 24 * 60 * 60 * 1000)
    }, timeUntilNoon)
    
    // 清理函数
    return () => {
      clearTimeout(updateInterval)
    }
  }, [])
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">加载失败</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* 博客头部区域 */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">我的技术博客</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          分享技术见解、生活感悟和学习心得，记录成长的每一步
        </p>
      </section>

      {/* 热门文章标题 */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">热门文章</h2>
        <Link 
          href="/all-posts" 
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          查看全部文章
        </Link>
      </div>

      {/* 文章卡片网格 - 只显示前3篇 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* 文章图片 */}
            {post.image && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {post.category?.name || '未分类'}
                  </span>
                </div>
              </div>
            )}
            
            {/* 文章内容 */}
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
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
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                <Link href={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex justify-between items-center mt-4">
                <Link 
                  href={`/posts/${post.id}`} 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors group"
                >
                  阅读更多
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <div className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 查看全部文章按钮 */}
      <div className="flex justify-center">
        <Link 
          href="/all-posts" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          查看全部文章
          <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}