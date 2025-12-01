'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { hasSensitiveWords, detectSensitiveWords } from '../../utils/违禁词检测'
import { adminAuth, getAdminHeaders } from '../../utils/admin-state-manager'

interface PostEditorModalProps {
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
}



export default function PostEditorModal({ isOpen, onClose, isAdmin = false }: PostEditorModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [hasSensitiveContent, setHasSensitiveContent] = useState(false)
  const [success, setSuccess] = useState('')
  const [faceIdAnimation, setFaceIdAnimation] = useState(false)
  const [showDraftSuccess, setShowDraftSuccess] = useState(false)
  const [showDraftError, setShowDraftError] = useState(false)
  // 图片上传相关状态
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')

  // 关闭弹窗时重置表单
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  // 打开弹窗时加载草稿
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem('blogDraft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setTitle(draft.title || '');
          setExcerpt(draft.excerpt || '');
          setContent(draft.content || '');
          setImage(draft.image || '');
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [isOpen])

  // 重置表单
  const resetForm = () => {
    setTitle('')
    setExcerpt('')
    setContent('')
    setImage('')
    setIsLoading(false)
    setError('')
    setSuccess('')
    setShowSuccessAnimation(false)
    setShowWarning(false)
    setHasSensitiveContent(false)
    setFaceIdAnimation(false)
    setShowDraftSuccess(false)
    setShowDraftError(false)
    // 重置上传相关状态
    setUploadProgress(0)
    setIsUploading(false)
    setUploadStatus('idle')
    setUploadMessage('')
  }



  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error')
      setUploadMessage('不支持的文件类型，请上传JPG、PNG或GIF格式的图片')
      return
    }
    
    // 检查文件大小（限制为5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadStatus('error')
      setUploadMessage('文件大小超过限制，请上传小于5MB的图片')
      return
    }
    
    // 真实上传过程
    setUploadStatus('uploading')
    setUploadProgress(0)
    
    try {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', file)
      
      // 调用真实的上传API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('上传失败')
      }
      
      const data = await response.json()
      
      // 设置图片URL
      setImage(data.url)
      setUploadStatus('success')
      setUploadMessage('图片上传成功')
      setUploadProgress(100)
    } catch (error) {
      setUploadStatus('error')
      setUploadMessage((error as Error).message || '文件上传失败，请稍后重试')
    }
  }
  
  // 触发文件选择对话框
  const triggerFileInput = () => {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    fileInput.click()
  }
  
  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    setShowSuccessAnimation(false)
    setShowWarning(false)
    setHasSensitiveContent(false)
    setFaceIdAnimation(false)

    try {
      // 简单的表单验证
      if (title && excerpt && content) {
        // 检测违禁词
        const allText = `${title} ${excerpt} ${content}`
        const hasSensitive = hasSensitiveWords(allText)
        const foundWords = detectSensitiveWords(allText)
        
        // 设置文章状态
        const status = hasSensitive ? 'pending' : 'published'
        
        // 获取当前登录用户信息
        let authorId: number = 1;
        let headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (isAdmin) {
          // 管理员发布文章
          const adminUser = adminAuth.getCurrentUser();
          if (adminUser) {
            authorId = adminUser.id;
          }
          headers = getAdminHeaders();
        } else {
          // 普通用户发布文章
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          authorId = currentUser.id || 1;
        }
        
        // 调用API发布文章
        const newPostData = {
          title,
          excerpt,
          content,
          image,
          categoryId: 1, // 默认分类ID为1
          authorId: authorId,
          readTime: Math.ceil(content.length / 500) // 简单计算阅读时间
        }
        
        // 调用API路由发布文章
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(newPostData),
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || '发布文章失败')
        }
        
        const newPost = await response.json()
        
        // 显示Face ID成功动画
        setFaceIdAnimation(true)
        
        // 保存敏感内容状态
        setHasSensitiveContent(hasSensitive)
        
        // 动画结束后显示反馈信息
        setTimeout(() => {
          // 显示成功信息
          setSuccess('文章已成功发布')
          
          // 如果含有违禁词，显示警告信息
          if (hasSensitive) {
            setShowWarning(true)
          }
          
          // 3秒后关闭弹窗
          setTimeout(() => {
            onClose()
            
            // 根据文章状态跳转
            if (isAdmin) {
              // 管理员发布文章后返回文章管理页面
              router.push('/admin/posts')
            } else if (hasSensitive) {
              // 普通用户发布的文章含有敏感词，返回用户主页
              router.push('/users/1')
            } else {
              // 普通用户发布的文章成功，跳转到文章详情页
              router.push(`/posts/${newPost.id}`)
            }
          }, 3000)
        }, 2000)
      } else {
        setError('请填写所有必填字段')
      }
    } catch (err) {
      setError((err as Error).message || '发布文章失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* Face ID成功动画 */}
      {faceIdAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="relative">
            {/* 圆形波纹扩散动画 */}
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" style={{ width: '200px', height: '200px', animationDuration: '2s' }}></div>
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" style={{ width: '200px', height: '200px', animationDuration: '2s', animationDelay: '0.3s' }}></div>
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-10 animate-ping" style={{ width: '200px', height: '200px', animationDuration: '2s', animationDelay: '0.6s' }}></div>
            
            {/* 中心成功图标 */}
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center animate-scale shadow-lg">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {/* 草稿箱错误弹窗 */}
      {showDraftError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 transform scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">操作失败</h3>
              <p className="text-gray-600 mb-6">未检测到文件键入，无法存入草稿箱</p>
              <button
                onClick={() => setShowDraftError(false)}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 弹窗主体 */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-100 hover:shadow-3xl">
        {/* 弹窗头部 */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {isAdmin ? '发布新文章' : '发布作品'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 弹窗内容 */}
        <div className="px-6 py-4">
          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 shadow-sm">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* 成功信息 */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 shadow-sm">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{success}</span>
            </div>
          )}
          
          {/* 违禁词警告信息 */}
          {showWarning && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 shadow-sm">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>该文章含有违禁词，需要通过审核才能正常发布</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* 文章标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                文章标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="请输入文章标题"
              />
            </div>

            {/* 文章摘要 */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                文章摘要 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="请输入文章摘要"
              ></textarea>
            </div>

            {/* 文章内容 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                文章内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="请输入文章内容"
              ></textarea>
            </div>



            {/* 文章图片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章图片
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="请输入图片 URL 或本地路径"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    上传图片
                  </button>
                </div>
                
                {/* 隐藏的文件输入 */}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {/* 上传进度显示 */}
                {uploadStatus === 'uploading' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>上传进度</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* 上传状态反馈 */}
                {uploadStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{uploadMessage}</span>
                  </div>
                )}
                
                {uploadStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{uploadMessage}</span>
                  </div>
                )}
                

              </div>
            </div>



            {/* 草稿箱成功提示 */}
            {showDraftSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 shadow-sm animate-fade-in">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>已存入草稿箱，仅支持本地存储</span>
              </div>
            )}

            {/* 弹窗底部 */}
            <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                取消
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // 验证是否有内容
                  if (!title.trim() && !excerpt.trim() && !content.trim() && !image.trim()) {
                    // 未检测到任何内容，显示错误弹窗
                    setShowDraftError(true);
                    return;
                  }
                  
                  // 存入草稿箱
                  const draft = {
                    title,
                    excerpt,
                    content,
                    image,
                    savedAt: new Date().toISOString()
                  };
                  localStorage.setItem('blogDraft', JSON.stringify(draft));
                  setShowDraftSuccess(true);
                  // 3秒后隐藏成功提示
                  setTimeout(() => setShowDraftSuccess(false), 3000);
                }}
                disabled={isLoading}
                className="px-6 py-3.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                存入草稿箱
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    发布中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    发布文章
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}