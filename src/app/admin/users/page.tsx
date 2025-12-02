'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { detectSensitiveWords, countHiddenCharacters } from '@/utils/违禁词检测'
import { adminAuth, listenToAdminStateChanges } from '@/utils/admin-state-manager'

// 用户类型
interface User {
  id: number
  name: string
  email: string
  password?: string
  usernameId: string
  avatar: string
  bio: string
  role: string
  inactive: boolean
  createdAt: string
}

// 编辑用户表单数据类型
interface EditUserFormData extends Partial<User> {
  newPassword?: string
  confirmPassword?: string
}

// 获取用户数据的函数
const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/api/users')
    if (!response.ok) {
      throw new Error('获取用户数据失败')
    }
    return await response.json()
  } catch (error) {
    console.error('获取用户数据失败:', error)
    return []
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  // 状态管理
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [showInactiveUsers, setShowInactiveUsers] = useState(false)
  const [success, setSuccess] = useState('')
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  // 编辑用户状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<EditUserFormData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [avatarError, setAvatarError] = useState<string>('')
  
  // 判断用户是否为不活跃用户
  const isInactiveUser = (user: User): boolean => {
    return user.inactive
  }

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

  // 获取用户数据
  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers()
    setUsers(fetchedUsers)
    setFilteredUsers(fetchedUsers)
  }

  // 初始加载用户数据
  useEffect(() => {
    loadUsers()
  }, [])

  // 定时同步数据（每小时一次）
  useEffect(() => {
    const syncInterval = setInterval(() => {
      loadUsers()
    }, 60 * 60 * 1000) // 1小时

    return () => clearInterval(syncInterval)
  }, [])

  // 搜索和筛选功能
  useEffect(() => {
    let result = [...users]
    
    // 搜索过滤
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      )
    }
    
    // 不活跃用户筛选
    if (showInactiveUsers) {
      result = result.filter(user => isInactiveUser(user))
    } else {
      result = result.filter(user => !isInactiveUser(user))
    }
    
    setFilteredUsers(result)
    // 搜索时重置到第一页
    setCurrentPage(1)
  }, [searchTerm, users, showInactiveUsers])

  // 计算当前页显示的用户数据
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // 分页控制函数
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // 打开编辑模态框
  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData(user)
    setAvatarPreview(user.avatar)
    setErrors({})
    setIsAddingUser(false)
    setIsEditModalOpen(true)
  }

  // 打开添加用户模态框
  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({})
    setAvatarPreview('')
    setErrors({})
    setIsAddingUser(true)
    setIsEditModalOpen(true)
  }

  // 关闭模态框
  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setEditingUser(null)
    setFormData({})
    setAvatarPreview('')
    setErrors({})
  }

  // 处理头像上传
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 限制文件大小为3MB
      const maxSize = 3 * 1024 * 1024 // 3MB
      if (file.size > maxSize) {
        setAvatarError(`图片大小超过限制（最大3MB），请重新选择图片`)
        // 清除预览和表单数据
        setAvatarPreview('')
        setFormData(prev => ({ ...prev, avatar: '' }))
        return
      }
      
      // 创建FormData对象，上传文件
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        // 调用上传API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || '头像上传失败')
        }
        
        const data = await response.json()
        
        // 设置预览和表单数据
        setAvatarPreview(data.url)
        setFormData(prev => ({ ...prev, avatar: data.url }))
        setAvatarError('')
      } catch (error) {
        setAvatarError((error as Error).message || '头像上传失败，请稍后重试')
        // 清除预览和表单数据
        setAvatarPreview('')
        setFormData(prev => ({ ...prev, avatar: '' }))
      }
    }
  }

  // 表单验证
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {}    
    
    // 检查头像错误
    if (avatarError) {
      newErrors.avatar = avatarError
    }
    
    if (!formData.name?.trim()) {
      newErrors.name = '请输入姓名'
    } else {
      // 违禁词检测
      const nameSensitiveWords = detectSensitiveWords(formData.name)
      if (nameSensitiveWords.length > 0) {
        newErrors.name = `姓名包含违禁词: ${nameSensitiveWords.join(', ')}`
      }
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = '请输入邮箱'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    } else {
      // 违禁词检测
      const emailSensitiveWords = detectSensitiveWords(formData.email)
      if (emailSensitiveWords.length > 0) {
        newErrors.email = `邮箱包含违禁词: ${emailSensitiveWords.join(', ')}`
      }
    }
    
    if (!formData.usernameId?.trim()) {
      newErrors.usernameId = '请输入用户名ID'
    } else {
      // 违禁词检测
      const usernameIdSensitiveWords = detectSensitiveWords(formData.usernameId)
      if (usernameIdSensitiveWords.length > 0) {
        newErrors.usernameId = `用户名ID包含违禁词: ${usernameIdSensitiveWords.join(', ')}`
      }
    }
    
    // 密码验证
    if (isAddingUser) {
      // 添加用户时，必须输入密码
      if (!formData.password?.trim()) {
        newErrors.password = '请输入初始密码'
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        newErrors.password = '密码长度至少为8个字符，包含大小写字母、数字和特殊符号'
      }
    } else {
      // 修改用户时，如果输入了新密码，需要验证
      if (formData.newPassword) {
        // 验证新密码强度
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.newPassword)) {
          newErrors.newPassword = '密码长度至少为8个字符，包含大小写字母、数字和特殊符号'
        }
        
        // 验证确认密码
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = '两次输入的密码不一致'
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 保存用户信息
  const handleSaveUser = async () => {
    const isValid = await validateForm()
    if (isValid) {
      try {
        // 确保avatar数据长度符合数据库字段限制
        let avatarUrl = formData.avatar || 'https://via.placeholder.com/100';
        // 如果是Data URL且长度超过限制，使用默认头像
        if (avatarUrl.startsWith('data:') && avatarUrl.length > 1 * 1024 * 1024) {
          avatarUrl = 'https://via.placeholder.com/100';
        }
        
        // 构建请求数据
        const requestData: {
          name: string;
          email: string;
          usernameId: string;
          avatar: string;
          role: string;
          password?: string;
        } = {
          name: formData.name || '',
          email: formData.email || '',
          usernameId: formData.usernameId || '',
          avatar: avatarUrl,
          role: formData.role || 'user'
        };
        
        // 如果有新密码，添加到请求数据中
        if (formData.newPassword) {
          requestData.password = formData.newPassword;
        }
        
        let response;
        if (isAddingUser) {
          // 添加新用户
          response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
          });
          setSuccess('用户添加成功');
        } else {
          // 更新现有用户
          response = await fetch(`/api/users/${editingUser?.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
          });
          setSuccess('用户信息更新成功');
        }

        if (!response.ok) {
          // 获取详细错误信息
          const errorData = await response.json().catch(() => ({}))
          console.error('保存用户失败的详细信息:', errorData)
          console.error('响应状态:', response.status)
          console.error('请求体:', JSON.stringify(requestData))
          throw new Error(errorData.error || errorData.message || `保存用户失败，状态码: ${response.status}`)
        }

        // 关闭模态框
        handleCloseModal()
        
        // 重新加载用户数据
        loadUsers()
        
        // 3秒后清除成功信息
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        console.error('保存用户信息失败:', error)
        setErrors({ general: error instanceof Error ? error.message : '保存用户信息失败，请稍后重试' })
      }
    }
  }

  // 删除用户
  const handleDelete = async (userId: number) => {
    try {
      // 首先获取用户的博文数量
      const postsResponse = await fetch(`/api/users/${userId}/posts/count`)
      const postsData = await postsResponse.json()
      const postCount = postsData.count || 0
      
      // 第一次确认：提示用户有X篇博文未删除
      let confirmDelete = false
      if (postCount > 0) {
        confirmDelete = confirm(`该用户还有${postCount}篇管理博文未删除，是否确认删除？删除用户将同时删除所有关联的博文。`)
      } else {
        confirmDelete = confirm('确定要删除这个用户吗？')
      }
      
      // 第二次确认：防止误操作
      if (confirmDelete) {
        confirmDelete = confirm('确定要执行删除操作吗？此操作不可恢复，将删除用户及其所有关联数据。')
      }
      
      if (confirmDelete) {
        // 执行删除操作
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ deletePosts: true }) // 指示服务器同时删除关联的博文
        })

        if (!response.ok) {
          // 尝试获取服务器返回的具体错误信息
          const errorData = await response.json().catch(() => ({}))
          // 使用服务器返回的错误信息，或者默认信息
          const errorMessage = errorData.message || errorData.error || '删除用户失败'
          throw new Error(errorMessage)
        }

        setSuccess('用户已删除')
        
        // 重新加载用户数据
        loadUsers()
        
        // 3秒后清除成功信息
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      // 显示具体的错误信息
      const errorMessage = error instanceof Error ? error.message : '删除用户失败，请稍后重试'
      setSuccess(errorMessage)
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInactiveUsers(!showInactiveUsers)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showInactiveUsers ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              {showInactiveUsers ? '活跃用户' : '不活跃用户'}
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/users/check-inactive', { method: 'POST' })
                  const result = await response.json()
                  if (result.success) {
                    setSuccess(`成功标记 ${result.affectedRows} 个不活跃用户`)
                    // 重新加载用户数据
                    loadUsers()
                    // 3秒后清除成功信息
                    setTimeout(() => setSuccess(''), 3000)
                  } else {
                    setSuccess('检查不活跃用户失败')
                    setTimeout(() => setSuccess(''), 3000)
                  }
                } catch (error) {
                  console.error('检查不活跃用户失败:', error)
                  setSuccess('检查不活跃用户失败')
                  setTimeout(() => setSuccess(''), 3000)
                }
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              检查不活跃用户
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              添加用户
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

        {/* 搜索栏 */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索用户名、邮箱或姓名..."
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

        {/* 用户列表 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className={isInactiveUser(user) ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {isInactiveUser(user) && (
                            <div className="text-xs text-red-500 mt-1">不活跃</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          修改
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
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
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex justify-center items-center space-x-2">
                {/* 上一页按钮 */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  上一页
                </button>
                
                {/* 页码按钮 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${currentPage === pageNumber ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                {/* 下一页按钮 */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
          
          {/* 空状态 */}
          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到用户</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? '尝试调整搜索条件' : '还没有用户'}
              </p>
            </div>
          )}
        </div>

        {/* 编辑用户模态框 */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* 模态框头部 */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {isAddingUser ? '添加用户' : '编辑用户'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 模态框内容 */}
              <div className="px-6 py-6">
                <form className="space-y-6">
                  {/* 头像上传 */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
                      <img
                        src={avatarPreview || 'https://via.placeholder.com/100'}
                        alt="用户头像"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-500">
                      点击上传头像，支持 JPG、PNG 格式
                    </p>
                    {avatarError && (
                      <p className="mt-1 text-sm text-red-600">{avatarError}</p>
                    )}
                    {errors.avatar && (
                      <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
                    )}
                  </div>

                  {/* 姓名 */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      姓名
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="请输入姓名"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* 邮箱 */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      邮箱
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="请输入邮箱"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* 用户名ID */}
                  <div>
                    <label htmlFor="usernameId" className="block text-sm font-medium text-gray-700 mb-1">
                      用户名ID
                    </label>
                    <input
                      type="text"
                      id="usernameId"
                      value={formData.usernameId || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, usernameId: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.usernameId ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="请输入用户名ID"
                    />
                    {errors.usernameId && (
                      <p className="mt-1 text-sm text-red-600">{errors.usernameId}</p>
                    )}
                  </div>

                  {/* 初始密码 - 只在添加用户时显示 */}
                  {isAddingUser ? (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        初始密码
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="请输入初始密码"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">修改密码（可选）</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            新密码
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            value={formData.newPassword || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="请输入新密码"
                          />
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            确认新密码
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="请再次输入新密码"
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 角色 */}
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      角色
                    </label>
                    <select
                      id="role"
                      value={formData.role || 'user'}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                    </select>
                  </div>
                </form>
              </div>

              {/* 模态框底部 */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  {isAddingUser ? '添加用户' : '保存修改'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
