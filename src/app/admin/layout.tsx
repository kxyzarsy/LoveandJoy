import type { Metadata } from 'next'
import '../../styles/globals.css'

// 管理员页面的元数据
export const metadata: Metadata = {
  title: '管理员后台',
  description: '博客管理后台',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {/* 管理员页面直接渲染内容，不使用主站的导航栏和页脚 */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
