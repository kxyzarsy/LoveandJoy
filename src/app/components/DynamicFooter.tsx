'use client'

import React, { useState, useEffect } from 'react'

// 页尾配置类型定义
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
  quick_links: Array<{ text: string; url: string }>
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
  created_at: string
  updated_at: string
}

const DynamicFooter = () => {
  const [config, setConfig] = useState<FooterConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminPage, setIsAdminPage] = useState(false)

  useEffect(() => {
    // 检查是否在管理员后台页面
    if (typeof window !== 'undefined') {
      const adminPage = window.location.pathname.startsWith('/admin')
      setIsAdminPage(adminPage)
    }
  }, [])

  useEffect(() => {
    // 获取页尾配置
  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/footer-config')
      if (response.ok) {
        const data = await response.json()
        
        // 处理quick_links
        if (typeof data.quick_links === 'string') {
          data.quick_links = JSON.parse(data.quick_links)
        }
        if (!data.quick_links) {
          data.quick_links = []
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
      }
    } catch (error) {
      console.error('获取页尾配置失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

    fetchConfig()
  }, [])

  // 如果是管理员页面，隐藏页尾
  if (isAdminPage) {
    return null
  }

  // 如果配置未加载，显示默认页尾
  if (isLoading || !config) {
    return (
      <footer className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">我的博客</h3>
              <p className="text-gray-600">分享技术见解、生活感悟和学习心得，记录成长的每一步。</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">联系我们</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <p className="text-gray-600">contact@example.com</p>
                </div>
                <div className="flex items-start">
                  <p className="text-gray-600">+86 123 4567 8910</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">快捷链接</h4>
              <div className="grid grid-cols-2 gap-3">
                <a href="/" className="text-gray-600 hover:text-blue-600">首页</a>
                <a href="/all-posts" className="text-gray-600 hover:text-blue-600">全部文章</a>
                <a href="/about" className="text-gray-600 hover:text-blue-600">关于我们</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">隐私政策</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-blue-100 text-center">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} 我的博客. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    )
  }

  // 替换版权文本中的{year}为当前年份
  const formattedCopyright = config.copyright_text.replace('{year}', new Date().getFullYear().toString())

  // 动态样式
  const footerStyle = {
    backgroundColor: config.background_color,
    color: config.text_color,
    fontSize: config.font_size,
    borderTopColor: config.border_color
  } as React.CSSProperties

  const linkStyle = {
    color: config.link_color
  } as React.CSSProperties

  const linkHoverStyle = {
    color: config.link_hover_color
  } as React.CSSProperties

  return (
    <footer 
      className="border-t py-12 transition-all duration-300" 
      style={footerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页脚内容区域 */}
        <div className={`grid grid-cols-1 gap-8 mb-8 ${config.layout_columns === 2 ? 'md:grid-cols-2' : config.layout_columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
          {/* 网站信息 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              {config.site_title}
            </h3>
            {config.site_description && (
              <p className="leading-relaxed">
                {config.site_description}
              </p>
            )}
            
            {/* 社交媒体链接 */}
            {config.show_social_media && (
              <div className="flex space-x-4">
                {config.social_facebook && (
                  <a 
                    href={config.social_facebook} 
                    className="transition-all duration-300 transform hover:-translate-y-1" 
                    style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                )}
                {config.social_twitter && (
                  <a 
                    href={config.social_twitter} 
                    className="transition-all duration-300 transform hover:-translate-y-1" 
                    style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                )}
                {config.social_instagram && (
                  <a 
                    href={config.social_instagram} 
                    className="transition-all duration-300 transform hover:-translate-y-1" 
                    style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                  </a>
                )}
                {config.social_github && (
                  <a 
                    href={config.social_github} 
                    className="transition-all duration-300 transform hover:-translate-y-1" 
                    style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                  </a>
                )}
                {config.social_linkedin && (
                  <a 
                    href={config.social_linkedin} 
                    className="transition-all duration-300 transform hover:-translate-y-1" 
                    style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* 联系方式 */}
          {config.show_contact_info && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">联系我们</h4>
              <div className="space-y-3">
                {config.email && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">邮箱地址</p>
                      <a 
                        href={`mailto:${config.email}`} 
                        className="transition-colors"
                        style={linkStyle}
                        onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                        onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                      >
                        {config.email}
                      </a>
                    </div>
                  </div>
                )}
                {config.phone && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">联系电话</p>
                      <a 
                        href={`tel:${config.phone}`} 
                        className="transition-colors"
                        style={linkStyle}
                        onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                        onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                      >
                        {config.phone}
                      </a>
                    </div>
                  </div>
                )}
                {config.address && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">办公地址</p>
                      <p>{config.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 快捷链接 */}
          {config.show_quick_links && config.quick_links && config.quick_links.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">快捷链接</h4>
              <div className="grid grid-cols-2 gap-3">
                {config.quick_links.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    className="transition-all duration-200 flex items-center gap-2 group"
                    style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 底部版权信息 */}
        {config.show_copyright && (
          <div className="pt-8 border-t" style={{ borderTopColor: config.border_color }}>
            <div className="flex flex-wrap justify-center items-center gap-4 text-center">
              <p>{formattedCopyright}</p>
              {config.quick_links && config.quick_links.length > 0 && (
                <div className="flex items-center gap-2">
                  {config.quick_links.slice(0, 3).map((link, index) => (
                    <React.Fragment key={index}>
                      <a 
                        href={link.url} 
                        className="transition-colors"
                        style={linkStyle}
                        onMouseEnter={(e) => e.currentTarget.style.color = config.link_hover_color}
                        onMouseLeave={(e) => e.currentTarget.style.color = config.link_color}
                      >
                        {link.text}
                      </a>
                      {index < 2 && <span className="text-gray-400">|</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}

export default DynamicFooter
