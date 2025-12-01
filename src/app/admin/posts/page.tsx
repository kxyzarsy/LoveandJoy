'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PostEditorModal from '../../components/PostEditorModal'
import { adminAuth, listenToAdminStateChanges, getAdminHeaders } from '../../../utils/admin-state-manager'

// 文章状态类型
type PostStatus = 'published' | 'pending' | 'rejected'

// 文章类型
interface Post {
  id: number
  title: string
  excerpt: string
  content: string
  categoryId: number
  image: string
  status: PostStatus
  foundSensitiveWords: string[]
  createdAt: string
  authorId: number
  reviewedBy: number | null
  reviewedAt: string | null
  rejectionReason: string | null
}

// 从API获取的真实数据类型扩展
interface PostWithAuthorAndCategory extends Post {
  author?: {
    id: number
    name: string
    avatar?: string
    username: string
  }
  category?: {
    id: number
    name: string
    slug: string
  }
}

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [showPostModal, setShowPostModal] = useState(false)
  // 添加状态筛选
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('published')

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = adminAuth.isAuthenticated()
      const user = adminAuth.getCurrentUser()
      
      // 如果未登录或不是管理员，重定向到管理员登录页面
      if (!isLoggedIn || !user || user.role !== 'admin') {
        router.push('/admin/login')
        return
      }
    }
    
    // 初始检查
    checkAuth()
    
    // 监听管理员状态变化
    const cleanup = listenToAdminStateChanges(checkAuth)
    
    return cleanup
  }, [router])

  // 加载文章数据
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // 从API获取文章数据
        const response = await fetch('/api/posts', {
          headers: getAdminHeaders()
        })
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const postsData = await response.json()
        setPosts(postsData)
        // 默认只显示已发布文章
        filterPosts(postsData, statusFilter, searchTerm)
      } catch (error) {
        console.error('Error loading posts:', error)
        setPosts([])
        setFilteredPosts([])
      }
    }
    
    loadPosts()
  }, [])

  // 统一的文章筛选函数
  const filterPosts = (postsToFilter: Post[], status: PostStatus | 'all', term: string) => {
    let result = postsToFilter
    
    // 按状态筛选
    if (status !== 'all') {
      result = result.filter(post => post.status === status)
    }
    
    // 按搜索词筛选
    if (term.trim() !== '') {
      const lowerTerm = term.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerTerm) ||
        post.excerpt.toLowerCase().includes(lowerTerm) ||
        post.content.toLowerCase().includes(lowerTerm)
      )
    }
    
    setFilteredPosts(result)
  }

  // 搜索功能
  useEffect(() => {
    filterPosts(posts, statusFilter, searchTerm)
  }, [searchTerm, posts, statusFilter])

  // 审核通过
  const handleApprove = async (postId: number) => {
    setIsLoading(true)
    setSuccess('')
    
    try {
      // 获取当前登录管理员ID
      const currentUser = adminAuth.getCurrentUser();
      if (!currentUser) {
        throw new Error('管理员未登录');
      }
      
      // 调用PUT API更新文章状态为通过
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          id: postId,
          status: 'published',
          reviewedBy: currentUser.id
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve post');
      }
      
      // 重新获取最新文章数据
      const fetchResponse = await fetch('/api/posts', {
        headers: getAdminHeaders()
      })
      
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const allPosts = await fetchResponse.json();
      setPosts(allPosts);
      filterPosts(allPosts, statusFilter, searchTerm);
      setSuccess('文章审核通过');
      
      // 3秒后清除成功信息
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('审核失败:', error);
      alert('审核失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setIsLoading(false);
    }
  }

  // 审核不通过
  const handleReject = async (postId: number) => {
    const reason = prompt('请输入拒绝原因:');
    if (!reason) return;
    
    setIsLoading(true);
    setSuccess('');
    
    try {
      // 获取当前登录管理员ID
      const currentUser = adminAuth.getCurrentUser();
      if (!currentUser) {
        throw new Error('管理员未登录');
      }
      
      // 调用PUT API更新文章状态为拒绝
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          id: postId,
          status: 'rejected',
          reviewedBy: currentUser.id,
          rejectionReason: reason
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject post');
      }
      
      // 重新获取最新文章数据
      const fetchResponse = await fetch('/api/posts', {
        headers: getAdminHeaders()
      });
      
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const allPosts = await fetchResponse.json();
      setPosts(allPosts);
      filterPosts(allPosts, statusFilter, searchTerm);
      setSuccess('文章审核不通过');
      
      // 3秒后清除成功信息
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('审核失败:', error);
      alert('审核失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setIsLoading(false);
    }
  }

  // 删除文章
  const handleDelete = async (postId: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    setIsLoading(true)
    setSuccess('')
    
    try {
      // 调用DELETE API删除文章
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete post')
      }
      
      // 从API获取最新文章数据
      const fetchResponse = await fetch('/api/posts', {
        headers: getAdminHeaders()
      })
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch posts')
      }
      const allPosts = await fetchResponse.json()
      
      // 更新文章列表
      setPosts(allPosts)
      setFilteredPosts(allPosts)
      setSuccess('文章已删除')
      
      // 3秒后清除成功信息
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 获取状态显示文本和样式
  const getStatusInfo = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return { text: '已发布', className: 'bg-green-100 text-green-800' }
      case 'pending':
        return { text: '审核中', className: 'bg-yellow-100 text-yellow-800' }
      case 'rejected':
        return { text: '未通过', className: 'bg-red-100 text-red-800' }
      default:
        return { text: '未知', className: 'bg-gray-100 text-gray-800' }
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPostModal(true)} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              发布文章
            </button>
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

        {/* 筛选和搜索区域 */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* 状态筛选 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">状态筛选:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="published">已发布</option>
              <option value="pending">待审核</option>
              <option value="rejected">未通过</option>
              <option value="all">全部</option>
            </select>
          </div>
          
          {/* 搜索栏 */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索文章标题、摘要或内容..."
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

        {/* 文章列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作者
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  {statusFilter === 'pending' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      违禁词
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => {
                  const statusInfo = getStatusInfo(post.status)
                  const author = (post as PostWithAuthorAndCategory).author || { name: '未知', username: 'unknown' }
                  const category = (post as PostWithAuthorAndCategory).category || { name: '未分类' }
                  
                  return (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {post.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{author.name}</div>
                        <div className="text-xs text-gray-500">@{author.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </td>
                      {statusFilter === 'pending' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            {post.foundSensitiveWords.length > 0 ? (
                              <span className="text-red-600">
                                {post.foundSensitiveWords.join(', ')}
                              </span>
                            ) : (
                              <span className="text-green-600">无</span>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {post.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(post.id)}
                                disabled={isLoading}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                通过
                              </button>
                              <button
                                onClick={() => handleReject(post.id)}
                                disabled={isLoading}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                不通过
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={isLoading}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                )}
              </tbody>
            </table>
          </div>
          
          {/* 空状态 */}
          {filteredPosts.length === 0 && (
            <div className="px-6 py-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到文章</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? '尝试调整搜索条件' : statusFilter === 'published' ? '还没有发布任何文章' : statusFilter === 'pending' ? '没有待审核的文章' : '没有未通过的文章'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* 发布文章弹窗 */}
      <PostEditorModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        isAdmin={true}
      />
    </div>
  )
}
