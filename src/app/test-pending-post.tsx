'use client'

import { useState } from 'react'
import { hasSensitiveWords, detectSensitiveWords } from '@/utils/违禁词检测'

// 测试组件，用于创建包含违禁词的文章
export default function TestPendingPost() {
  const [title, setTitle] = useState('测试文章标题')
  const [content, setContent] = useState('这是一篇包含违禁词的测试文章，操你妈的，傻逼')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setSuccess('')
    setError('')

    try {
      // 检测违禁词
      const allText = `${title} ${content}`
      const hasSensitive = hasSensitiveWords(allText)
      const foundWords = detectSensitiveWords(allText)
      

      
      // 设置文章状态
      const status = hasSensitive ? 'pending' : 'published'
      
      // 保存到localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      const newPost = {
        id: posts.length + 1,
        title,
        excerpt: content.substring(0, 100) + '...',
        content,
        categoryId: 1,
        image: 'https://via.placeholder.com/300',
        status,
        foundSensitiveWords: foundWords,
        createdAt: new Date().toISOString(),
        authorId: 1,
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null
      }
      posts.push(newPost)
      localStorage.setItem('posts', JSON.stringify(posts))
      
      setSuccess(`文章已创建，状态：${status}`)
    } catch (err) {
      setError('创建文章失败')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">测试待审核文章创建</h1>
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        创建测试文章
      </button>
    </div>
  )
}