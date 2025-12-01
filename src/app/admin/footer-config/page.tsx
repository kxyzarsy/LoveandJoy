'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuth, listenToAdminStateChanges } from '@/utils/admin-state-manager'

// 类型定义
interface FooterConfig {
  id: number
  site_title: string
  site_description: string
  email: string
  phone: string
  address: string
  social_facebook: string
  social_twitter: string
  social_instagram: string
  social_github: string
  social_linkedin: string
  quick_links: { text: string; url: string }[]
  background_color: string
  text_color: string
  link_color: string
  link_hover_color: string
  border_color: string
  font_size: string
  layout_columns: number
  show_social_media: boolean
  show_contact_info: boolean
  show_quick_links: boolean
  show_copyright: boolean
  copyright_text: string
}

export default function FooterConfigPage() {
  const router = useRouter()
  const [config, setConfig] = useState<FooterConfig>({
    id: 0,
    site_title: '',
    site_description: '',
    email: '',
    phone: '',
    address: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_github: '',
    social_linkedin: '',
    quick_links: [{ text: '', url: '' }],
    background_color: '#f8f9fa',
    text_color: '#6c757d',
    link_color: '#007bff',
    link_hover_color: '#0056b3',
    border_color: '#dee2e6',
    font_size: '14px',
    layout_columns: 3,
    show_social_media: true,
    show_contact_info: true,
    show_quick_links: true,
    show_copyright: true,
    copyright_text: '© 2025 Love and Joy. All rights reserved.'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // 检查登录状态和管理员权限
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

  // 获取当前页尾配置
  const fetchFooterConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/footer-config')
      if (!response.ok) {
        throw new Error('获取页尾配置失败')
      }
      const data = await response.json()
      
      // 处理quick_links
      if (typeof data.quick_links === 'string') {
        data.quick_links = JSON.parse(data.quick_links)
      }
      if (!data.quick_links) {
        data.quick_links = [{ text: '', url: '' }]
      }
      
      // 确保所有字符串字段不为null，转换为空字符串
      const processedData = {
        ...data,
        site_title: data.site_title || '',
        site_description: data.site_description || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        social_facebook: data.social_facebook || '',
        social_twitter: data.social_twitter || '',
        social_instagram: data.social_instagram || '',
        social_github: data.social_github || '',
        social_linkedin: data.social_linkedin || '',
        copyright_text: data.copyright_text || ''
      }
      
      setConfig(processedData)
    } catch (error) {
      console.error('获取页尾配置失败:', error)
      setErrorMessage('获取页尾配置失败，请刷新页面重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 初始化数据
  useEffect(() => {
    fetchFooterConfig()
  }, [])

  // 更新配置
  const handleSave = async () => {
    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')
    
    try {
      const response = await fetch('/api/footer-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) {
        throw new Error('保存页尾配置失败')
      }
      
      setSuccessMessage('页尾配置保存成功！')
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    } catch (error) {
      console.error('保存页尾配置失败:', error)
      setErrorMessage('保存页尾配置失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  // 添加快捷链接
  const addQuickLink = () => {
    setConfig(prev => ({
      ...prev,
      quick_links: [...prev.quick_links, { text: '', url: '' }]
    }))
  }

  // 删除快捷链接
  const removeQuickLink = (index: number) => {
    setConfig(prev => ({
      ...prev,
      quick_links: prev.quick_links.filter((_, i) => i !== index)
    }))
  }

  // 更新快捷链接
  const updateQuickLink = (index: number, field: 'text' | 'url', value: string) => {
    setConfig(prev => ({
      ...prev,
      quick_links: prev.quick_links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载页尾配置...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">页尾样式管理</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            返回仪表盘
          </button>
        </div>

        {/* 消息提示 */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">成功：</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">错误：</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：配置表单 */}
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">基本信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">网站标题</label>
                  <input
                    type="text"
                    value={config.site_title}
                    onChange={(e) => setConfig(prev => ({ ...prev, site_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
                  <textarea
                    value={config.site_description}
                    onChange={(e) => setConfig(prev => ({ ...prev, site_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* 联系方式 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">联系方式</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => setConfig(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                  <input
                    type="tel"
                    value={config.phone}
                    onChange={(e) => setConfig(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <textarea
                    value={config.address}
                    onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* 社交媒体 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">社交媒体链接</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={config.social_facebook}
                    onChange={(e) => setConfig(prev => ({ ...prev, social_facebook: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={config.social_twitter}
                    onChange={(e) => setConfig(prev => ({ ...prev, social_twitter: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={config.social_instagram}
                    onChange={(e) => setConfig(prev => ({ ...prev, social_instagram: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={config.social_github}
                    onChange={(e) => setConfig(prev => ({ ...prev, social_github: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={config.social_linkedin}
                    onChange={(e) => setConfig(prev => ({ ...prev, social_linkedin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* 快捷链接 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">快捷链接</h2>
                <button
                  onClick={addQuickLink}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  添加链接
                </button>
              </div>
              <div className="space-y-4">
                {config.quick_links.map((link, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">链接文本</label>
                        <input
                          type="text"
                          value={link.text}
                          onChange={(e) => updateQuickLink(index, 'text', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="链接文本"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">链接URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeQuickLink(index)}
                      className="mt-6 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：样式和布局 */}
          <div className="space-y-6">
            {/* 样式设置 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">样式设置</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">背景色</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.background_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, background_color: e.target.value }))}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.background_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, background_color: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">文字颜色</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.text_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, text_color: e.target.value }))}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.text_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, text_color: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#6c757d"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">链接颜色</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.link_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, link_color: e.target.value }))}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.link_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, link_color: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#007bff"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">链接悬停颜色</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.link_hover_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, link_hover_color: e.target.value }))}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.link_hover_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, link_hover_color: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#0056b3"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">边框颜色</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.border_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, border_color: e.target.value }))}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.border_color}
                      onChange={(e) => setConfig(prev => ({ ...prev, border_color: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#dee2e6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
                  <input
                    type="text"
                    value={config.font_size}
                    onChange={(e) => setConfig(prev => ({ ...prev, font_size: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="14px"
                  />
                </div>
              </div>
            </div>

            {/* 布局设置 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">布局设置</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">栏目数量</label>
                  <select
                    value={config.layout_columns}
                    onChange={(e) => setConfig(prev => ({ ...prev, layout_columns: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1列</option>
                    <option value={2}>2列</option>
                    <option value={3}>3列</option>
                    <option value={4}>4列</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-800">显示选项</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="show_social_media"
                      checked={config.show_social_media}
                      onChange={(e) => setConfig(prev => ({ ...prev, show_social_media: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="show_social_media" className="text-sm text-gray-700">显示社交媒体</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="show_contact_info"
                      checked={config.show_contact_info}
                      onChange={(e) => setConfig(prev => ({ ...prev, show_contact_info: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="show_contact_info" className="text-sm text-gray-700">显示联系信息</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="show_quick_links"
                      checked={config.show_quick_links}
                      onChange={(e) => setConfig(prev => ({ ...prev, show_quick_links: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="show_quick_links" className="text-sm text-gray-700">显示快捷链接</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="show_copyright"
                      checked={config.show_copyright}
                      onChange={(e) => setConfig(prev => ({ ...prev, show_copyright: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="show_copyright" className="text-sm text-gray-700">显示版权信息</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">版权文本</label>
                  <textarea
                    value={config.copyright_text}
                    onChange={(e) => setConfig(prev => ({ ...prev, copyright_text: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    保存中...
                  </div>
                ) : (
                  '保存配置'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}