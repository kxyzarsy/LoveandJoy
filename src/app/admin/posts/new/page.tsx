'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { hasSensitiveWords, detectSensitiveWords } from '../../../../utils/违禁词检测'

const categories = [
  { id: 1, name: '技术', slug: 'tech' },
  { id: 2, name: '生活', slug: 'life' },
  { id: 3, name: '学习', slug: 'study' },
  { id: 4, name: '工作', slug: 'work' },
]

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState(1)
  const [image, setImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [hasSensitiveContent, setHasSensitiveContent] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    
    // 如果未登录或不是管理员，重定向到登录页面
    if (!isLoggedIn || !user) {
      router.push('/login')
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    setShowSuccessAnimation(false)
    setShowWarning(false)
    setHasSensitiveContent(false)

    try {
      // 简单的表单验证
      if (title && excerpt && content) {
        // 检测违禁词
        const allText = `${title} ${excerpt} ${content}`
        const hasSensitive = hasSensitiveWords(allText)
        const foundWords = detectSensitiveWords(allText)
        
        // 模拟发布文章请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 设置文章状态
        const status = hasSensitive ? 'pending' : 'published'
        
        // 这里可以添加实际的发布文章逻辑

        // 调用API发布文章
        const newPostData = {
          title,
          excerpt,
          content,
          categoryId,
          image,
          status,
          foundSensitiveWords: foundWords,
          createdAt: new Date().toISOString(),
          authorId: 1, // 假设当前用户ID为1
          reviewedBy: null,
          reviewedAt: null,
          rejectionReason: null,
          likes: 0 // 添加点赞数字段，默认为0
        }
        
        // 调用API路由发布文章
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPostData),
        })
        
        if (!response.ok) {
          throw new Error('发布文章失败')
        }
        
        const newPost = await response.json()
        
        // 显示发布成功动画
        setShowSuccessAnimation(true)
        
        // 保存敏感内容状态
        setHasSensitiveContent(hasSensitive)
        
        // 动画结束后显示反馈信息
        setTimeout(() => {
          // 显示成功信息
          setSuccess('文章已成功发布')
          
          // 如果含有违禁词，显示警告信息
          if (hasSensitive) {
            setShowWarning(true)
          }
          
          // 根据文章状态跳转
          if (hasSensitive) {
            // 跳转到个人主页
            setTimeout(() => {
              router.push('/users/1')
            }, 3000)
          } else {
            // 跳转到文章详情页
            setTimeout(() => {
              router.push(`/posts/${newPost.id}`)
            }, 2000)
          }
        }, 1500)
      } else {
        setError('请填写所有必填字段')
      }
    } catch (err) {
      setError('发布文章失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">发布新文章</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
        >
          返回
        </button>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* 发布成功动画 */}
      {showSuccessAnimation && (
        <div className="flex justify-center items-center mb-6 py-12">
          <div className="relative">
            {/* 圆形进度动画 */}
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            {/* 成功图标 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {/* 成功信息 */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}
      
      {/* 违禁词警告信息 */}
      {showWarning && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>该文章含有违禁词，需要通过审核才能正常发布</span>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            文章标题
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入文章标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            文章摘要
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入文章摘要"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            文章内容
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入文章内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            文章分类
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            文章图片 URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入文章图片 URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? '发布中...' : '发布文章'}
          </button>
        </div>
      </form>
    </div>
  )
}