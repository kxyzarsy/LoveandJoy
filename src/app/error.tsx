'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  // 5秒后自动跳转到首页
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 错误图标 */}
        <div className="mb-6">
          <svg className="w-24 h-24 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        {/* 错误标题 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">500 - 服务器内部错误</h1>
        
        {/* 错误描述 */}
        <p className="text-gray-600 mb-8">
          抱歉，服务器发生了内部错误。
          <br />
          您将在 <span className="font-semibold text-blue-600">5秒</span> 后自动返回首页。
        </p>
        
        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* 重试按钮 */}
          <button
            onClick={() => reset()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重试
          </button>
          
          {/* 返回首页按钮 */}
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
        
        {/* 辅助信息 */}
        <p className="mt-8 text-sm text-gray-500">
          错误详情：
          <br />
          <span className="text-red-500 font-mono text-xs">{error.message}</span>
        </p>
      </div>
    </div>
  )
}