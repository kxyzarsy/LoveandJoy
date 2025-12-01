'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { validateSecret, logLoginAttempt } from '../../admin-secret'
import { adminAuth } from '../../../utils/admin-state-manager'

/**
 * 隐藏式管理员登录页面
 * 只有知道正确URL的用户才能访问
 */
export default function SecretAdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [errors, setErrors] = useState<{ message?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSecretField, setShowSecretField] = useState(false)

  // 隐藏式入口验证：只有输入正确的初始密码才能显示秘钥字段
  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const initialPassword = formData.get('initialPassword') as string
    
    // 初始密码验证（简单的隐藏入口机制）
    if (initialPassword === 'admin-portal') {
      setShowSecretField(true)
    } else {
      // 记录失败尝试
      logLoginAttempt({
        username: 'unknown',
        ipAddress: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
        isSuccess: false,
        errorMessage: '初始密码错误'
      })
      setErrors({ message: '访问被拒绝' })
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // 记录登录尝试
      await logLoginAttempt({
        username,
        ipAddress: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
        isSuccess: false
      })

      // 验证管理员秘钥
      const isSecretValid = await validateSecret(secretKey)
      if (!isSecretValid) {
        await logLoginAttempt({
          username,
          ipAddress: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
          isSuccess: false,
          errorMessage: '管理员秘钥错误'
        })
        setErrors({ message: '管理员秘钥错误' })
        return
      }

      // 通过API进行登录验证
      // 检查输入是否为邮箱格式
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
      
      // 根据输入类型构建请求体
      let loginBody = {};
      if (isEmail) {
        // 如果是邮箱，直接使用
        loginBody = {
          email: username,
          password
        };
      } else {
        // 如果不是邮箱，尝试通过用户名ID查询用户邮箱
        try {
          const userResponse = await fetch(`/api/users?usernameId=${username}`);
          const userData = await userResponse.json();
          
          if (userData.length > 0) {
            // 使用查询到的邮箱进行登录
            loginBody = {
              email: userData[0].email,
              password
            };
          } else {
            // 如果查询不到，返回错误
            await logLoginAttempt({
              username,
              ipAddress: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
              userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
              isSuccess: false,
              errorMessage: '用户名不存在'
            });
            setErrors({ message: '用户名不存在' });
            return;
          }
        } catch (error) {
          console.error('查询用户邮箱失败:', error);
          setErrors({ message: '登录失败，请重试' });
          return;
        }
      }
      
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginBody)
      })

      const loginData = await loginResponse.json()
      
      if (!loginResponse.ok || !loginData.success) {
        await logLoginAttempt({
          username,
          ipAddress: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
          isSuccess: false,
          errorMessage: loginData.message || '用户名或密码错误'
        })
        setErrors({ message: loginData.message || '用户名或密码错误' })
        return
      }

      // 登录成功，记录登录日志
      await logLoginAttempt({
        username,
        ipAddress: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
        isSuccess: true
      })

      // 设置管理员用户数据
      const userData = {
        id: loginData.data.userInfo.id,
        name: loginData.data.userInfo.name,
        username: loginData.data.userInfo.usernameId,
        email: loginData.data.userInfo.email,
        avatar: loginData.data.userInfo.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        bio: '系统管理员',
        role: loginData.data.userInfo.role as 'admin' | 'user',
        createdAt: new Date().toISOString()
      }
      
      // 使用管理员专用状态管理工具保存登录状态
      adminAuth.login(userData, loginData.data.token)

      // 跳转到管理员后台首页
      router.push('/admin')
    } catch (error) {
      console.error('登录失败:', error)
      setErrors({ message: '登录失败，请重试' })
      
      // 记录失败日志
      await logLoginAttempt({
        username,
        ipAddress: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
        isSuccess: false,
        errorMessage: '系统错误'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showSecretField ? '管理员登录' : '访问验证'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {showSecretField ? '请输入管理员账号、密码和秘钥' : '请输入访问密码'}
          </p>
        </div>

        {errors.message && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.message}
          </div>
        )}

        {!showSecretField ? (
          // 初始访问验证表单
          <form className="mt-8 space-y-6" onSubmit={handleInitialSubmit}>
            <div>
              <label htmlFor="initialPassword" className="sr-only">
                访问密码
              </label>
              <input
                id="initialPassword"
                name="initialPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="请输入访问密码"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                验证访问
              </button>
            </div>
          </form>
        ) : (
          // 完整管理员登录表单
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="secretKey" className="sr-only">
                  管理员秘钥
                </label>
                <input
                  id="secretKey"
                  name="secretKey"
                  type="password"
                  required
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="管理员秘钥"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
