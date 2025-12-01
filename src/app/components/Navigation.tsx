'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import PostEditorModal from './PostEditorModal'

export default function Navigation() {
  // 登录状态管理
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mockUser, setMockUser] = useState({
    id: 1,
    name: '博主',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  })
  
  // 发布文章弹窗状态
  const [showPostModal, setShowPostModal] = useState(false)
  const [isAdminPage, setIsAdminPage] = useState(false)
  
  // 从localStorage获取登录状态和用户数据
  const updateUserInfo = () => {
    // 从localStorage获取登录状态
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
    
    // 从localStorage获取用户数据
    const user = localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {
          id: 1,
          name: '博主',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        }
    setMockUser(user)
    
    // 检查是否在管理员后台页面
    if (typeof window !== 'undefined') {
      const adminPage = window.location.pathname.startsWith('/admin')
      setIsAdminPage(adminPage)
    }
  };

  useEffect(() => {
    // 初始化时获取用户信息
    updateUserInfo();
    
    // 监听自定义事件，当localStorage变化时更新用户信息
    const handleStorageChange = () => {
      updateUserInfo();
    };
    
    // 监听popstate事件，当页面导航时更新用户信息
    const handlePopState = () => {
      updateUserInfo();
    };
    
    // 直接调用updateUserInfo，确保在事件触发时立即更新
    const handleUserLoggedIn = () => {
      updateUserInfo();
    };
    
    // 添加事件监听器
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleStorageChange);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleStorageChange);
    };
  }, [])
  
  // 检查是否为管理员用户
  const isAdminUser = mockUser.name === '管理员'

  return (
    // 导航栏
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center h-16">
          {/* Logo - 始终显示 */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900">我的博客</a>
          </div>

          {/* 桌面端导航 - 只在非管理员页面显示 */}
          {!isAdminPage && (
            <nav className="hidden md:flex space-x-4 items-center">
              {/* 全部文章 */}
              <a
                href="/all-posts"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                全部文章
              </a>
              
              {/* 关于 */}
              <a
                href="/about"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                关于
              </a>
            </nav>
          )}

          {/* 用户认证区域 - 只在非管理员页面显示 */}
          {!isAdminPage && (
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                // 已登录状态：显示用户头像和悬停菜单
                <>
                  {/* 用户头像和悬停菜单 */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100">
                        <img
                          src={mockUser.avatar}
                          alt={mockUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden md:inline">
                        {mockUser.name}
                      </span>
                    </button>
                    
                    {/* 悬停菜单 */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                      {/* 个人主页 */}
                      <a
                        href={`/users/${mockUser.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        个人主页
                      </a>
                      
                      {/* 发布文章 */}
                      <button
                        onClick={() => setShowPostModal(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        发布文章
                      </button>
                      
                      {/* 退出登录 */}
                      <button
                        onClick={async () => {
                          try {
                            // 清除所有登录相关的存储信息
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('user');
                            localStorage.removeItem('posts'); // 清除可能的本地存储数据
                            
                            // 立即更新组件状态，确保UI实时反映退出登录状态
                            updateUserInfo();
                            
                            // 重定向到登录页面
                            window.location.href = '/login';
                          } catch (error) {
                            console.error('退出登录失败:', error);
                            alert('退出登录失败，请重试');
                          }
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // 未登录状态：显示登录按钮
                <a
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  登录
                </a>
              )}
            </div>
          )}
        </div>

        {/* 移动端导航菜单按钮 - 只在非管理员页面显示 */}
        {!isAdminPage && (
          <div className="md:hidden flex items-center justify-between">
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* 发布文章弹窗 */}
      <PostEditorModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        isAdmin={isAdminPage}
      />
    </header>
  )
}