'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminAuth, listenToAdminStateChanges } from '@/utils/admin-state-manager'

// 评论类型
interface Comment {
  id: number
  content: string
  createdAt: string
  author: {
    id: number
    name: string
    avatar: string
  }
  post: {
    id: number
    title: string
  }
  isApproved: boolean
}

// 模拟评论数据
const mockComments: Comment[] = [
  {
    id: 1,
    content: '这是一条很好的评论，内容很有价值！',
    createdAt: new Date().toISOString(),
    author: {
      id: 2,
      name: '用户1',
      avatar: 'https://via.placeholder.com/100'
    },
    post: {
      id: 1,
      title: '欢迎来到我的博客'
    },
    isApproved: true
  },
  {
    id: 2,
    content: '我有不同的看法，我认为...',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    author: {
      id: 3,
      name: '用户2',
      avatar: 'https://via.placeholder.com/100'
    },
    post: {
      id: 2,
      title: 'Next.js 入门指南'
    },
    isApproved: true
  },
  {
    id: 3,
    content: '这篇文章写得真好，学到了很多！',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    author: {
      id: 4,
      name: '用户3',
      avatar: 'https://via.placeholder.com/100'
    },
    post: {
      id: 1,
      title: '欢迎来到我的博客'
    },
    isApproved: false
  },
  {
    id: 4,
    content: '期待更多这样的内容！',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    author: {
      id: 5,
      name: '用户4',
      avatar: 'https://via.placeholder.com/100'
    },
    post: {
      id: 3,
      title: 'Tailwind CSS 实用技巧'
    },
    isApproved: true
  }
]

export default function AdminCommentsPage() {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredComments, setFilteredComments] = useState<Comment[]>(mockComments)
  const [success, setSuccess] = useState('')

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = adminAuth.isAuthenticated()
      const user = adminAuth.getCurrentUser()
      
      // 如果未登录或不是管理员，重定向到管理员登录页面
      if (!isLoggedIn || !user || user.role !== 'admin') {
        router.push('/admin/secret-login')
        return
      }
    }
    
    // 初始检查
    checkAuth()
    
    // 监听管理员状态变化
    const cleanup = listenToAdminStateChanges(checkAuth)
    
    return cleanup
  }, [router])

  // 搜索功能
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredComments(comments)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = comments.filter(comment => 
        comment.content.toLowerCase().includes(term) ||
        comment.author.name.toLowerCase().includes(term) ||
        comment.post.title.toLowerCase().includes(term)
      )
      setFilteredComments(filtered)
    }
  }, [searchTerm, comments])

  // 切换评论审核状态
  const toggleApprove = (commentId: number) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isApproved: !comment.isApproved
        }
      }
      return comment
    })
    setComments(updatedComments)
    setFilteredComments(updatedComments)
    setSuccess('评论状态已更新')
    
    // 3秒后清除成功信息
    setTimeout(() => setSuccess(''), 3000)
  }

  // 删除评论
  const handleDelete = (commentId: number) => {
    if (confirm('确定要删除这条评论吗？')) {
      const updatedComments = comments.filter(comment => comment.id !== commentId)
      setComments(updatedComments)
      setFilteredComments(updatedComments)
      setSuccess('评论已删除')
      
      // 3秒后清除成功信息
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">评论管理</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              返回后台
            </Link>
          </div>
        </div>

        {/* 成功信息 */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        {/* 搜索栏 */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索评论内容、用户名或文章标题..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 评论列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评论内容
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作者
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    文章
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComments.map((comment) => (
                  <tr key={comment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {comment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="line-clamp-2">{comment.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/posts/${comment.post.id}`} className="text-blue-600 hover:underline">
                        {comment.post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comment.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {comment.isApproved ? '已审核' : '待审核'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleApprove(comment.id)}
                          className={`${comment.isApproved ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {comment.isApproved ? '取消审核' : '审核通过'}
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 空状态 */}
          {filteredComments.length === 0 && (
            <div className="px-6 py-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到评论</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? '尝试调整搜索条件' : '还没有评论'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
