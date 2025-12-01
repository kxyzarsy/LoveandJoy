'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminAuth, listenToAdminStateChanges, getAdminHeaders } from '../../utils/admin-state-manager'

// 类型定义
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
}

interface User {
  id: number
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  createdAt: string
  role: 'admin' | 'user'
}

interface Category {
  id: number
  name: string
  slug: string
  createdAt: string
  postsCount: number
}

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

export default function AdminDashboard() {
  const router = useRouter()
  
  // 初始状态优化，减少闪烁
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    totalCategories: 0,
  })
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  
  // 从API获取真实数据
  const fetchStats = React.useCallback(async () => {
    try {
      const headers = getAdminHeaders();
      
      const response = await fetch('/api/dashboard-stats', {
        headers: headers
      })
      
      if (!response.ok) {
        // 获取详细的错误信息
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || '未知错误';
        
        // 处理401错误（令牌无效或过期）
        if (response.status === 401) {
          // 清除本地状态
          adminAuth.logout();
          // 显示错误信息
          setError(`认证失败: ${errorMessage}，请重新登录`);
          // 重定向到登录页面
          setTimeout(() => {
            router.push('/admin/secret-login');
          }, 2000);
          return;
        }
        
        // 处理其他错误
        throw new Error(`获取数据失败: ${response.status} ${response.statusText} - ${errorMessage}`);
      }
      
      const data = await response.json()
      
      setStats({
        totalPosts: data.totalPosts,
        totalUsers: data.totalUsers,
        totalComments: data.totalComments,
        totalCategories: data.totalCategories,
      })
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取数据失败，请稍后重试';
      setError(errorMessage);
      console.error('获取仪表盘数据失败:', err);
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // 检查登录状态和管理员权限，并初始化数据
  useEffect(() => {
    // 立即检查登录状态，避免不必要的渲染
    const isLoggedIn = adminAuth.isAuthenticated()
    const user = adminAuth.getCurrentUser()
    
    // 如果未登录或不是管理员，重定向到管理员登录页面
    if (!isLoggedIn || !user || user.role !== 'admin') {
      router.push('/admin/secret-login')
      return
    }
    
    // 初始加载数据
    fetchStats();
    
    // 设置自动刷新
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 60000) // 每分钟刷新一次
      setRefreshInterval(interval);
    }
    
    // 监听管理员状态变化
    const cleanup = listenToAdminStateChanges(() => {
      const isLoggedIn = adminAuth.isAuthenticated()
      const user = adminAuth.getCurrentUser()
      
      if (!isLoggedIn || !user || user.role !== 'admin') {
        router.push('/admin/secret-login')
      }
    })
    
    // 清理函数
    return () => {
      cleanup()
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    }
  }, [router, fetchStats, autoRefresh])

  // 手动刷新数据
  const handleManualRefresh = () => {
    fetchStats()
  }

  // 切换自动刷新
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">管理员后台</h1>
          <div className="flex items-center gap-4">
            {/* 数据刷新控制 */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    刷新中...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    刷新
                  </>
                )}
              </button>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={toggleAutoRefresh}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-700">自动刷新</label>
              </div>
            </div>
            
            <span className="text-sm text-gray-600">欢迎，管理员</span>
            <button
              onClick={async () => {
                try {
                  // 使用管理员专用状态管理工具退出登录
                  adminAuth.logout();
                  
                  // 重定向到管理员登录页面
                  window.location.href = '/admin/login';
                } catch (error) {
                  console.error('退出登录失败:', error);
                  alert('退出登录失败，请重试');
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">错误：</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总文章数</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPosts}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总用户数</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总评论数</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalComments}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总分类数</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCategories}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 管理功能菜单 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/admin/posts" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">文章管理</h3>
                <p className="text-gray-600 mt-1">查看、编辑、发布和审核文章</p>
              </div>
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </Link>

          <Link 
            href="/admin/users" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-green-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">用户管理</h3>
                <p className="text-gray-600 mt-1">管理用户账户和权限</p>
              </div>
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </Link>

          <Link 
            href="/admin/comments" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-purple-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">评论管理</h3>
                <p className="text-gray-600 mt-1">审核和管理评论</p>
              </div>
              <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </Link>
          
          <Link 
            href="/admin/docs" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-indigo-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">文档管理</h3>
                <p className="text-gray-600 mt-1">查看和管理项目文档</p>
              </div>
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </Link>

          <Link 
            href="/admin/credentials" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-red-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">凭证管理</h3>
                <p className="text-gray-600 mt-1">修改管理员密钥和初始访问密码</p>
              </div>
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </Link>

          <Link 
            href="/admin/footer-config" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-orange-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">页尾样式管理</h3>
                <p className="text-gray-600 mt-1">配置页尾的联系方式、样式和布局</p>
              </div>
              <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}