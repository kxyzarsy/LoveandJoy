'use client'

import { useEffect } from 'react'

export default function TestErrorPage() {
  useEffect(() => {
    // 模拟服务器错误
    throw new Error('测试500错误页面')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-900">测试错误页面</h1>
    </div>
  )
}