'use client'

import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import PostEditorModal from '../../components/PostEditorModal'

// 文章状态类型
type PostStatus = 'published' | 'pending' | 'rejected'

// 用户类型
interface User {
  id: number
  name: string
  usernameId: string
  bio: string
  avatar: string
  backgroundImage: string
  email: string
  createdAt: string
}

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

// 模拟分类数据
const mockCategories = [
  { id: 1, name: '技术', slug: 'tech' },
  { id: 2, name: '生活', slug: 'life' },
  { id: 3, name: '学习', slug: 'study' },
  { id: 4, name: '工作', slug: 'work' }
]

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // 使用React.use()解包params Promise
  const resolvedParams = use(params)
  const userId = parseInt(resolvedParams.id)
  
  // 状态管理
  const [user, setUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [postsCount, setPostsCount] = useState(0)
  const followersCount = 0
  const followingCount = 0
  const [isLoading, setIsLoading] = useState(true)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  
  // 密码修改表单状态
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  
  // 个人信息编辑状态
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editUsernameId, setEditUsernameId] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [editBackgroundImage, setEditBackgroundImage] = useState('')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingBackground, setIsUploadingBackground] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [profileSuccess, setProfileSuccess] = useState('')
  // 用户名修改限制相关状态
  const [remainingUsernameChangeHours, setRemainingUsernameChangeHours] = useState(0)
  const [canModifyUsernameId, setCanModifyUsernameId] = useState(true)
  const [showUsernameConfirmModal, setShowUsernameConfirmModal] = useState(false)
  const [usernameIdChangePending, setUsernameIdChangePending] = useState(false)
  const [countdownTimer, setCountdownTimer] = useState<NodeJS.Timeout | null>(null)
  
  // 密码修改表单提交处理
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 重置错误和成功信息
    setErrors({})
    setSuccess('')
    
    // 检查user是否存在
    if (!user) {
      setErrors({ submit: '用户信息未加载' })
      return
    }
    
    // 表单验证
    const newErrors: Record<string, string> = {}
    
    // 验证旧密码
    if (!oldPassword.trim()) {
      newErrors.oldPassword = '请输入旧密码'
    }
    
    // 验证新密码
    if (!newPassword.trim()) {
      newErrors.newPassword = '请输入新密码'
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      newErrors.newPassword = '新密码至少需要8位，包含大小写字母、数字和特殊符号'
    }
    
    // 验证确认密码
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = '请确认新密码'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    // 普通用户需要验证邮箱验证码
    if (user.name !== '管理员') {
      if (!verificationCode.trim()) {
        newErrors.verificationCode = '请输入邮箱验证码'
      } else if (!codeSent) {
        newErrors.verificationCode = '请先发送验证码'
      }
    }
    
    // 如果有错误，显示错误信息
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // 验证验证码
    if (user.name !== '管理员') {
      try {
        const verifyResponse = await fetch(`/api/auth/send-verification-code?email=${encodeURIComponent(user.email)}&code=${encodeURIComponent(verificationCode)}`, {
          method: 'GET'
        })
        
        const verifyResult = await verifyResponse.json()
        
        if (!verifyResult.success) {
          setErrors(prev => ({ ...prev, verificationCode: verifyResult.message }))
          return
        }
      } catch (error) {
        console.error('验证验证码失败:', error)
        setErrors(prev => ({ ...prev, verificationCode: '验证码验证失败，请稍后重试' }))
        return
      }
    }
    
    // 调用密码修改API
    try {
      const response = await fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || '密码修改失败')
      }
      
      // 清除表单
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setVerificationCode('')
      setCodeSent(false)
      setCountdown(0)
      
      // 显示成功信息
      setSuccess('密码修改成功')
      
      // 3秒后关闭模态框
      setTimeout(() => {
        setShowChangePasswordModal(false)
        setSuccess('')
      }, 3000)
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: (error as Error).message || '密码修改失败，请稍后重试' }))
    }
  }
  
  // 打开个人信息编辑模态框
  const handleOpenEditModal = () => {
    if (!user) return
    
    // 初始化表单数据
    setEditName(user.name || '')
    setEditUsernameId(user.usernameId || '')
    setEditBio(user.bio || '')
    setEditAvatar(user.avatar || '')
    setEditBackgroundImage(user.backgroundImage || '')
    setProfileErrors({})
    setProfileSuccess('')
    setShowEditProfileModal(true)
  }
  
  // 处理头像上传
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setProfileErrors(prev => ({ ...prev, avatar: '不支持的文件类型，请上传JPG、PNG或GIF格式的图片' }))
      return
    }
    
    // 检查文件大小（限制为2MB）
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      setProfileErrors(prev => ({ ...prev, avatar: '文件大小超过限制，请上传小于2MB的图片' }))
      return
    }
    
    setIsUploadingAvatar(true)
    
    try {
      // 创建FormData对象，上传文件
      const formData = new FormData()
      formData.append('file', file)
      
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
      setEditAvatar(data.url)
      setProfileErrors(prev => ({ ...prev, avatar: '' }))
    } catch (error) {
      setProfileErrors(prev => ({ ...prev, avatar: (error as Error).message || '头像上传失败，请稍后重试' }))
    } finally {
      setIsUploadingAvatar(false)
      // 清空文件输入，允许重新选择同一文件
      e.target.value = ''
    }
  }
  
  // 处理背景图上传
  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setProfileErrors(prev => ({ ...prev, backgroundImage: '不支持的文件类型，请上传JPG、PNG或GIF格式的图片' }))
      return
    }
    
    // 检查文件大小（限制为5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setProfileErrors(prev => ({ ...prev, backgroundImage: '文件大小超过限制，请上传小于5MB的图片' }))
      return
    }
    
    setIsUploadingBackground(true)
    
    try {
      // 创建FormData对象，上传文件
      const formData = new FormData()
      formData.append('file', file)
      
      // 调用上传API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '背景图上传失败')
      }
      
      const data = await response.json()
      setEditBackgroundImage(data.url)
      setProfileErrors(prev => ({ ...prev, backgroundImage: '' }))
    } catch (error) {
      setProfileErrors(prev => ({ ...prev, backgroundImage: (error as Error).message || '背景图上传失败，请稍后重试' }))
    } finally {
      setIsUploadingBackground(false)
      // 清空文件输入，允许重新选择同一文件
      e.target.value = ''
    }
  }
  
  // 处理个人信息编辑表单提交
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 重置错误和成功信息
    setProfileErrors({})
    setProfileSuccess('')
    
    // 检查user是否存在
    if (!user) {
      setProfileErrors({ submit: '用户信息未加载' })
      return
    }
    
    // 表单验证
    const newErrors: Record<string, string> = {}
    
    // 验证用户名
    if (!editName || !editName.trim()) {
      newErrors.name = '请输入用户名'
    }
    
    // 验证用户名ID
    if (!editUsernameId || !editUsernameId.trim()) {
      newErrors.usernameId = '请输入用户名ID'
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(editUsernameId)) {
      newErrors.usernameId = '用户名ID只能包含字母、数字和下划线，长度为3-20个字符'
    }
    
    // 检查用户名ID是否被修改
    const isUsernameIdChanged = user.usernameId !== editUsernameId
    
    // 如果用户名ID被修改，检查是否有修改权限
    if (isUsernameIdChanged) {
      if (!canModifyUsernameId) {
        newErrors.usernameId = `用户名ID只能每720小时修改一次，还需等待${remainingUsernameChangeHours}小时`
      }
    }
    
    // 如果有错误，显示错误信息
    if (Object.keys(newErrors).length > 0) {
      setProfileErrors(newErrors)
      return
    }
    
    // 如果用户名ID被修改，显示确认对话框
    if (isUsernameIdChanged) {
      setUsernameIdChangePending(true)
      setShowUsernameConfirmModal(true)
      return
    }
    
    // 直接提交其他修改
    await submitProfileChanges()
  }
  
  // 确认用户名ID修改
  const confirmUsernameIdChange = async () => {
    setShowUsernameConfirmModal(false)
    await submitProfileChanges()
  }
  
  // 取消用户名ID修改
  const cancelUsernameIdChange = () => {
    setShowUsernameConfirmModal(false)
    setUsernameIdChangePending(false)
  }
  
  // 提交个人信息修改
  const submitProfileChanges = async () => {
    setIsSubmitting(true)
    
    try {
      // 构建更新数据，只包含数据库中存在的字段
    const updateData: Partial<User> = {
      name: editName,
      usernameId: editUsernameId,
      bio: editBio,
      avatar: editAvatar,
      backgroundImage: editBackgroundImage
    }
      
      // 调用API更新用户信息
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString() // 添加当前用户ID到请求头，用于权限验证
        },
        body: JSON.stringify(updateData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '更新失败')
      }
      
      const updatedUser = await response.json()
      
      // 更新本地状态
      setUser(updatedUser)
      setRemainingUsernameChangeHours(updatedUser.remainingUsernameChangeHours)
      setCanModifyUsernameId(updatedUser.remainingUsernameChangeHours === 0)
      
      // 更新localStorage中的用户信息（如果是当前登录用户）
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      // 显示成功信息
      setProfileSuccess('个人信息更新成功')
      
      // 3秒后关闭模态框
      setTimeout(() => {
        setShowEditProfileModal(false)
        setProfileSuccess('')
        setUsernameIdChangePending(false)
      }, 3000)
    } catch (error) {
      setProfileErrors(prev => ({
        ...prev, 
        submit: (error as Error).message || '更新失败，请稍后重试'
      }))
      setUsernameIdChangePending(false)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // 发送邮箱验证码
  const handleSendVerificationCode = async () => {
    if (isSendingCode || countdown > 0 || !user) return
    
    setIsSendingCode(true)
    
    try {
      // 调用API发送验证码
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: user.email })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCodeSent(true)
        setCountdown(60)
        
        // 开始倒计时
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setErrors(prev => ({ ...prev, verificationCode: result.message || '验证码发送失败，请稍后重试' }))
      }
    } catch (error) {
      console.error('发送验证码失败:', error)
      setErrors(prev => ({ ...prev, verificationCode: '验证码发送失败，请稍后重试' }))
    } finally {
      setIsSendingCode(false)
    }
  }
  
  // 加载用户数据和文章数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // 从API获取用户数据
        const userResponse = await fetch(`/api/users/${userId}`)
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await userResponse.json()
        
        // 确保用户数据包含所有必要字段
        const completeUserData = {
          ...userData,
          usernameId: userData.usernameId || `user${userId}`,
          backgroundImage: userData.backgroundImage || '',
          role: userData.role || 'user',
          lastLoginAt: userData.lastLoginAt || null,
          lastUsernameChange: userData.lastUsernameChange || null
        }
        
        // 更新用户状态
        setUser(completeUserData)
        setRemainingUsernameChangeHours(0)
        setCanModifyUsernameId(true)
        
        // 更新localStorage中的用户信息（如果是当前登录用户）
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('user', JSON.stringify(completeUserData))
      }
        
        // 从API获取文章数据
        const postsResponse = await fetch('/api/posts')
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts')
        }
        const posts = await postsResponse.json() as Post[]
        // 筛选当前用户的文章
        const filteredPosts = posts.filter(post => post.authorId === userId)
        setUserPosts(filteredPosts)
        setPostsCount(filteredPosts.length)
      } catch (error) {
        console.error('Error loading data:', error)
        setUser(null)
        setUserPosts([])
        setPostsCount(0)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [userId])
  
  // 用户名修改倒计时
  useEffect(() => {
    // 如果有剩余时间，设置倒计时
    if (remainingUsernameChangeHours > 0 && canModifyUsernameId === false) {
      const timer = setInterval(() => {
        setRemainingUsernameChangeHours(prev => {
          if (prev <= 1) {
            setCanModifyUsernameId(true)
            return 0
          }
          return prev - 1
        })
      }, 3600000) // 每小时更新一次
      
      setCountdownTimer(timer)
    }
    
    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer)
      }
    }
  }, [remainingUsernameChangeHours, canModifyUsernameId])
  
  // 加载状态显示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  // 只有在加载完成后才检查用户是否存在
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">用户不存在</h1>
          <p className="text-gray-600 mb-8">抱歉，您访问的用户不存在。</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    )
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
    <div className="space-y-8">
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* 封面图 */}
        <div className="h-32 relative">
          {user.backgroundImage ? (
            <img
              src={user.backgroundImage}
              alt="背景图"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          )}
        </div>
        
        {/* 用户信息 */}
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* 头像 */}
            <div className="-mt-16 mr-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={user.avatar || 'https://via.placeholder.com/200'}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* 基本信息 */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-sm text-gray-500">@{user.usernameId}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-3">
                    {/* 关注按钮 */}
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
                      关注
                    </button>
                    
                    {/* 发布文章按钮 - 仅在访问自己的主页时显示 */}
                    {userId === user.id && (
                      <button
                        onClick={() => setShowPostModal(true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                        </svg>
                        发布文章
                      </button>
                    )}
                    
                    {/* 编辑个人信息按钮 - 仅在访问自己的主页时显示 */}
                    {userId === user.id && (
                      <button
                        onClick={handleOpenEditModal}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        编辑资料
                      </button>
                    )}
                    
                    {/* 修改密码按钮 - 仅在访问自己的主页时显示 */}
                    {userId === user.id && (
                      <button
                        onClick={() => setShowChangePasswordModal(true)}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 15v-2h3v-3h2v3h3v2h-3v3h-2v-3h-3z" />
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" />
                        </svg>
                        修改密码
                      </button>
                    )}
                  </div>
                </div>
              
              {/* 个人简介 */}
              <p className="mt-3 text-gray-600">{user.bio || '这个人很懒，还没有填写个人简介'}</p>
              
              {/* 统计数据 */}
              <div className="mt-4 flex space-x-8">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 mr-1">{postsCount}</span>
                  <span className="text-gray-500">文章</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 mr-1">{followersCount}</span>
                  <span className="text-gray-500">粉丝</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 mr-1">{followingCount}</span>
                  <span className="text-gray-500">关注</span>
                </div>
              </div>
              
              {/* 注册时间 */}
              <p className="mt-3 text-sm text-gray-500">
                注册于 {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 用户文章列表 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">发布的文章</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {userPosts.map((post) => {
            const statusInfo = getStatusInfo(post.status)
            const category = mockCategories.find(c => c.id === post.categoryId) || { name: '未分类' }
            
            return (
              <div key={post.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* 文章图片 */}
                  {post.image && (
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* 文章内容 */}
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mr-3">
                        {category.name}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full mr-3 ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <Link href={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    
                    {/* 拒绝原因 */}
                    {post.status === 'rejected' && post.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
                        <p className="text-sm text-red-700">
                          <strong>未通过原因:</strong> {post.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* 空状态 */}
        {userPosts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">该用户还没有发布任何文章</p>
          </div>
        )}
      </div>
      
      {/* 修改密码模态框 */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* 模态框头部 */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">修改密码</h2>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 模态框内容 */}
            <div className="px-6 py-6">
              {/* 成功信息 */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                  {success}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleChangePassword}>
                {/* 旧密码 */}
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    旧密码
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="请输入旧密码"
                  />
                  {errors.oldPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
                  )}
                </div>
                
                {/* 新密码 */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    新密码
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="请输入新密码"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>
                
                {/* 确认新密码 */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="请再次输入新密码"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* 邮箱验证 - 普通用户需要 */}
                {user.name !== '管理员' && (
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                      邮箱验证码
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="请输入邮箱验证码"
                      />
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={isSendingCode || countdown > 0}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isSendingCode || countdown > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                      >
                        {isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s后重试` : '发送验证码'}
                      </button>
                    </div>
                    {errors.verificationCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.verificationCode}</p>
                    )}
                  </div>
                )}
                
                {/* 模态框底部 */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    确认修改
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* 个人信息编辑模态框 */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            {/* 模态框头部 */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">编辑个人信息</h2>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 模态框内容 */}
            <div className="px-6 py-6">
              {/* 成功信息 */}
              {profileSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                  {profileSuccess}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleEditProfile}>
                {/* 头像上传 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    头像
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={editAvatar}
                        alt="头像预览"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        id="avatarUpload"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('avatarUpload')?.click()}
                        disabled={isUploadingAvatar}
                        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${isUploadingAvatar ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                      >
                        {isUploadingAvatar ? '上传中...' : '上传头像'}
                      </button>
                      {profileErrors.avatar && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.avatar}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 背景图上传 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    背景图
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={editBackgroundImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=200&fit=crop'}
                        alt="背景图预览"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        id="backgroundUpload"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleBackgroundUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('backgroundUpload')?.click()}
                        disabled={isUploadingBackground}
                        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${isUploadingBackground ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                      >
                        {isUploadingBackground ? '上传中...' : '上传背景图'}
                      </button>
                      {profileErrors.backgroundImage && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.backgroundImage}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 用户名 */}
                <div>
                  <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${profileErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="请输入用户名"
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name}</p>
                  )}
                </div>
                
                {/* 用户名ID */}
                <div>
                  <label htmlFor="editUsernameId" className="block text-sm font-medium text-gray-700 mb-1">
                    用户名ID
                  </label>
                  <input
                    type="text"
                    id="editUsernameId"
                    value={editUsernameId}
                    onChange={(e) => setEditUsernameId(e.target.value)}
                    disabled={!canModifyUsernameId}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${profileErrors.usernameId ? 'border-red-500' : 'border-gray-300'} ${!canModifyUsernameId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="请输入用户名ID"
                  />
                  {profileErrors.usernameId && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.usernameId}</p>
                  )}
                  {!canModifyUsernameId && (
                    <p className="mt-1 text-sm text-yellow-600">
                      用户名ID只能每720小时修改一次，还需等待：{remainingUsernameChangeHours}小时
                    </p>
                  )}
                  {canModifyUsernameId && (
                    <p className="mt-1 text-sm text-gray-500">
                      用户名ID每720小时可修改一次
                    </p>
                  )}
                </div>
                
                {/* 个人简介 */}
                <div>
                  <label htmlFor="editBio" className="block text-sm font-medium text-gray-700 mb-1">
                    个人简介
                  </label>
                  <textarea
                    id="editBio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="请输入个人简介"
                  ></textarea>
                </div>
                
                {/* 模态框底部 */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? '保存中...' : '保存修改'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* 用户名ID修改确认模态框 */}
      {showUsernameConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* 模态框头部 */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">确认修改用户名ID</h2>
            </div>
            
            {/* 模态框内容 */}
            <div className="px-6 py-6">
              <p className="text-gray-600 mb-4">
                您确定要将用户名ID从 <strong>@{user.usernameId}</strong> 修改为 <strong>@{editUsernameId}</strong> 吗？
              </p>
              <p className="text-yellow-600 text-sm mb-6">
                注意：用户名ID修改后，您将需要等待720小时才能再次修改。
              </p>
              
              {/* 模态框底部 */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelUsernameIdChange}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmUsernameIdChange}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? '确认中...' : '确认修改'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 发布文章弹窗 */}
      <PostEditorModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        isAdmin={false}
      />
    </div>
  )
}