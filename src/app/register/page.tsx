'use client'
import Link from 'next/link'
import { useState } from 'react'
import { detectSensitiveWords } from '@/utils/违禁词检测'

// 用户类型定义
interface User {
  username: string
  email: string
}

export default function RegisterPage() {
  // 表单验证状态
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
    verificationCode?: string
    usernameId?: string
  }>({})
  // 注册错误状态
  const [error, setError] = useState('')
  // 验证码相关状态
  const [verificationCode, setVerificationCode] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [usernameId, setUsernameId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 验证码发送处理
  const handleSendVerificationCode = async () => {
    // 获取当前输入的邮箱
    const currentEmail = document.getElementById('email') as HTMLInputElement
    const emailValue = currentEmail?.value || ''
    
    // 简单验证邮箱格式
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailValue || !emailRegex.test(emailValue)) {
      setSendStatus('请先输入有效的邮箱地址')
      return
    }
    
    setIsSending(true)
    setSendStatus('')
    
    try {
      // 调用API发送验证码
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSendStatus(result.message)
        
        // 启动60秒倒计时
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setSendStatus(result.message || '验证码发送失败，请稍后重试')
      }
    } catch (error) {
      console.error('发送验证码失败:', error)
      setSendStatus('验证码发送失败，请稍后重试')
    } finally {
      setIsSending(false)
    }
  }

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const usernameId = formData.get('usernameId') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // 重置错误
    setErrors({})

    // 表单验证
    const newErrors: typeof errors = {}
    
    // 从localStorage获取现有用户数据
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    
    // 用户名验证
    if (!username.trim()) {
      newErrors.username = '用户名不能为空'
    } else if (username.length < 3 || username.length > 20) {
      newErrors.username = '用户名长度必须在3-20个字符之间'
    } else {
      // 违禁词检测
      const usernameSensitiveWords = detectSensitiveWords(username)
      if (usernameSensitiveWords.length > 0) {
        newErrors.username = `用户名包含违禁词: ${usernameSensitiveWords.join(', ')}`
      }
      // 用户名唯一性检查
      const isUsernameExists = existingUsers.some((user: User) => user.username === username)
      if (isUsernameExists) {
        newErrors.username = '该用户名已被注册'
      }
    }
    
    // 用户名ID验证
    if (!usernameId.trim()) {
      newErrors.usernameId = '用户名ID不能为空'
    } else if (usernameId.length < 3 || usernameId.length > 20) {
      newErrors.usernameId = '用户名ID长度必须在3-20个字符之间'
    } else if (!/^[a-zA-Z0-9_]+$/.test(usernameId)) {
      newErrors.usernameId = '用户名ID只能包含字母、数字和下划线'
    } else {
      // 用户名ID唯一性检查
      const isUsernameIdExists = existingUsers.some((user: any) => user.usernameId === usernameId)
      if (isUsernameIdExists) {
        newErrors.usernameId = '该用户名ID已被注册'
      }
    }
    
    // 邮箱格式验证 - 支持主流邮箱服务提供商
    const validEmailDomains = ['qq.com', '163.com', '126.com', 'yeah.net', 'gmail.com', 'outlook.com', 'hotmail.com', 'sina.com', 'sina.cn', '139.com', '189.cn']
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!emailRegex.test(email)) {
      newErrors.email = '请输入有效的邮箱地址'
    } else {
      const emailDomain = email.split('@')[1].toLowerCase()
      if (!validEmailDomains.includes(emailDomain)) {
        newErrors.email = '请使用支持的邮箱服务提供商（QQ、网易、谷歌等）'
      }
      // 违禁词检测
      const emailSensitiveWords = detectSensitiveWords(email)
      if (emailSensitiveWords.length > 0) {
        newErrors.email = `邮箱包含违禁词: ${emailSensitiveWords.join(', ')}`
      }
      // 邮箱唯一性检查
      const isEmailExists = existingUsers.some((user: User) => user.email === email)
      if (isEmailExists) {
        newErrors.email = '该邮箱已被注册'
      }
    }
    
    // 密码验证
    if (!password) {
      newErrors.password = '密码不能为空'
    } else if (password.length < 6) {
      newErrors.password = '密码长度不能少于6个字符'
    }
    
    // 确认密码验证
    if (!confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    // 验证码验证
    if (!verificationCode.trim()) {
      newErrors.verificationCode = '请输入验证码'
    }
    
    // 如果有错误，显示错误信息
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // 验证验证码
    try {
      const verifyResponse = await fetch(`/api/auth/send-verification-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`, {
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
    
    // 注册成功，调用API保存用户数据
    try {
      const registerResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
          usernameId: usernameId,
          avatar: 'https://via.placeholder.com/100',
          bio: ''
        })
      })
      
      if (registerResponse.ok) {
        alert('注册成功！')
        // 跳转到登录页面
        window.location.href = '/login'
      } else {
        const errorData = await registerResponse.json()
        setError(errorData.error || '注册失败，请稍后重试')
      }
    } catch (error) {
      console.error('注册失败:', error)
      setError('注册失败，请稍后重试')
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          创建新账户
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          或{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            登录到现有账户
          </Link>
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 用户名 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className={`appearance-none relative block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* 用户名ID */}
          <div>
            <label htmlFor="usernameId" className="block text-sm font-medium text-gray-700 mb-1">
              用户名ID
            </label>
            <input
              id="usernameId"
              name="usernameId"
              type="text"
              autoComplete="usernameId"
              className={`appearance-none relative block w-full px-3 py-2 border ${errors.usernameId ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="用户名ID（用于URL，如：myblog）"
              value={usernameId}
              onChange={(e) => setUsernameId(e.target.value)}
            />
            {errors.usernameId && (
              <p className="mt-1 text-sm text-red-600">{errors.usernameId}</p>
            )}
          </div>

          {/* 邮箱 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`appearance-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* 密码 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={`appearance-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* 确认密码 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              确认密码
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`appearance-none relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="确认密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 验证码 */}
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
              验证码
            </label>
            <div className="flex space-x-2">
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                className={`appearance-none relative block flex-1 px-3 py-2 border ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleSendVerificationCode()}
                disabled={isSending || countdown > 0}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSending ? '发送中...' : countdown > 0 ? `${countdown}s后重试` : '发送验证码'}
              </button>
            </div>
            {sendStatus && (
              <p className={`mt-1 text-sm ${sendStatus.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>{sendStatus}</p>
            )}
            {errors.verificationCode && (
              <p className="mt-1 text-sm text-red-600">{errors.verificationCode}</p>
            )}
          </div>

          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              注册
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}