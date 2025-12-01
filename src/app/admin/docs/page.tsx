'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { adminAuth, listenToAdminStateChanges } from '@/utils/admin-state-manager'

// 文档类型定义
interface Document {
  name: string
  path: string
  createdAt: string
  updatedAt: string
  size: number
}

export default function AdminDocsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [docContent, setDocContent] = useState<string>('')

  // 检查登录状态和权限
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

  // 获取文档列表
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // 注意：在实际生产环境中，应该通过API从服务器获取文件列表
        // 这里我们使用模拟数据，因为Next.js客户端组件无法直接访问文件系统
        
        // 模拟文档数据
        const mockDocuments: Document[] = [
          {
            name: 'bug-fix-example.md',
            path: '/docs/bug-fix-example.md',
            createdAt: '2025-11-28T18:28:00.000Z',
            updatedAt: '2025-11-28T18:28:00.000Z',
            size: 2048
          },
          {
            name: '今日工作记录_20251129.md',
            path: '/docs/今日工作记录_20251129.md',
            createdAt: '2025-11-29T07:49:00.000Z',
            updatedAt: '2025-11-29T07:49:00.000Z',
            size: 4906
          },
          {
            name: '用户管理API测试结果_20251130.json',
            path: '/docs/用户管理API测试结果_20251130.json',
            createdAt: '2025-11-30T00:00:00.000Z',
            updatedAt: '2025-11-30T00:00:00.000Z',
            size: 2048
          },
          {
            name: '文档管理模块测试文档_20251130.md',
            path: '/docs/文档管理模块测试文档_20251130.md',
            createdAt: '2025-11-30T12:00:00.000Z',
            updatedAt: '2025-11-30T12:00:00.000Z',
            size: 5000
          }
        ]
        
        setDocuments(mockDocuments)
      } catch (err) {
        setError('获取文档列表失败')
        console.error('Error fetching documents:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDocuments()
  }, [])

  // 查看文档内容
  const handleViewDocument = async (doc: Document) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // 从服务器获取文档内容
      const response = await fetch(doc.path)
      
      if (!response.ok) {
        throw new Error('获取文档内容失败')
      }
      
      const content = await response.text()
      setDocContent(content)
      setSelectedDoc(doc.name)
    } catch (err) {
      setError('获取文档内容失败')
      console.error('Error fetching document content:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 下载文档
  const handleDownloadDocument = (doc: Document) => {
    // 创建下载链接
    const link = document.createElement('a')
    link.href = doc.path
    link.download = doc.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">文档管理</h1>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            返回后台首页
          </Link>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* 文档列表和内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 文档列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">文档列表</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无文档
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.name} 
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedDoc === doc.name ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900" onClick={() => handleViewDocument(doc)}>{doc.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{formatSize(doc.size)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDocument(doc);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="下载文档"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div>创建：{formatDate(doc.createdAt)}</div>
                        <div>更新：{formatDate(doc.updatedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 文档内容 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              {selectedDoc ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedDoc}</h2>
                    <div className="flex gap-3">
                      {/* 下载按钮 */}
                      <button 
                        onClick={() => {
                          const doc = documents.find(d => d.name === selectedDoc);
                          if (doc) {
                            handleDownloadDocument(doc);
                          }
                        }}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下载
                      </button>
                      {/* 关闭按钮 */}
                      <button 
                        onClick={() => setSelectedDoc(null)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      {selectedDoc?.endsWith('.md') || selectedDoc?.endsWith('.markdown') ? (
                        // Markdown文档，使用ReactMarkdown渲染
                        <ReactMarkdown
                          components={{
                            code({ node, className, children, ref, ...props }) {
                              const match = /language-(\w+)/.exec(className || '')
                              // 判断是否为内联代码：如果没有className或不包含language-前缀，则为内联代码
                              const isInline = !match
                              return !isInline ? (
                                <SyntaxHighlighter
                                  style={tomorrow as unknown}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {docContent}
                        </ReactMarkdown>
                      ) : selectedDoc?.endsWith('.json') ? (
                        // JSON文档，格式化显示
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                          <code>{JSON.stringify(JSON.parse(docContent), null, 2)}</code>
                        </pre>
                      ) : (
                        // 其他类型文档，纯文本显示
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                          <code>{docContent}</code>
                        </pre>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">选择文档查看</h3>
                  <p className="text-gray-500">从左侧列表中选择一个文档查看其内容</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}