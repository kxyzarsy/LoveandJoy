import type { Metadata } from 'next'
import '../styles/globals.css'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import DynamicFooter from './components/DynamicFooter'

export const metadata: {
  title: string
  description: string
} = {
  title: '个人博客',
  description: '分享我的生活和思考',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {/* 导航栏 - 使用客户端组件处理登录状态 */}
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        
        {/* 动态页尾 */}
        <DynamicFooter />
      </body>
    </html>
  )
}