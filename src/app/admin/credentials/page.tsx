'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth, listenToAdminStateChanges } from '@/utils/admin-state-manager';

const CredentialsPage = () => {
  const router = useRouter();
  
  // 检查登录状态和管理员权限
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = adminAuth.isAuthenticated();
      const user = adminAuth.getCurrentUser();
      
      // 如果未登录或不是管理员，重定向到管理员登录页面
      if (!isLoggedIn || !user || user.role !== 'admin') {
        router.push('/admin/secret-login');
        return;
      }
    };
    
    // 初始检查
    checkAuth();
    
    // 监听管理员状态变化
    const cleanup = listenToAdminStateChanges(checkAuth);
    
    return cleanup;
  }, [router]);
  const [activeTab, setActiveTab] = useState('secret-key');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMessage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">凭证管理</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'secret-key' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => handleTabChange('secret-key')}
          >
            修改管理员密钥
          </button>
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'access-password' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => handleTabChange('access-password')}
          >
            修改初始访问密码
          </button>
        </nav>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'secret-key' && (
          <SecretKeyForm setMessage={setMessage} />
        )}
        
        {activeTab === 'access-password' && (
          <AccessPasswordForm setMessage={setMessage} />
        )}
      </div>
    </div>
  );
};

const SecretKeyForm = ({ setMessage }: { setMessage: (message: { type: 'success' | 'error'; text: string } | null) => void }) => {
  const [currentKey, setCurrentKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateKey = (key: string) => {
    if (key.length < 16) {
      return '密钥长度至少为16个字符';
    }
    if (!/[A-Z]/.test(key)) {
      return '密钥必须包含至少一个大写字母';
    }
    if (!/[a-z]/.test(key)) {
      return '密钥必须包含至少一个小写字母';
    }
    if (!/[0-9]/.test(key)) {
      return '密钥必须包含至少一个数字';
    }
    if (!/[^A-Za-z0-9]/.test(key)) {
      return '密钥必须包含至少一个特殊字符';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    const validationError = validateKey(newKey);
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    if (newKey !== confirmKey) {
      setMessage({ type: 'error', text: '新密钥与确认密钥不匹配' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/credentials/secret-key', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentKey, newKey }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: '管理员密钥更新成功' });
        setCurrentKey('');
        setNewKey('');
        setConfirmKey('');
      } else {
        setMessage({ type: 'error', text: data.error || '更新失败，请重试' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '服务器错误，请稍后重试' });
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">修改管理员密钥</h2>
      
      {showConfirm && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">确认操作</p>
          <p>您确定要修改管理员密钥吗？此操作将影响所有管理员的访问权限。</p>
          <div className="mt-2 flex space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => setShowConfirm(false)}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              确认修改
            </button>
          </div>
        </div>
      )}

      {!showConfirm && (
        <>
          <div className="mb-4">
            <label htmlFor="currentKey" className="block text-sm font-medium text-gray-700 mb-1">当前管理员密钥</label>
            <input
              type="password"
              id="currentKey"
              value={currentKey}
              onChange={(e) => setCurrentKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="newKey" className="block text-sm font-medium text-gray-700 mb-1">新管理员密钥</label>
            <input
              type="password"
              id="newKey"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {newKey && (
              <p className="mt-1 text-xs text-gray-500">
                {validateKey(newKey) || '密钥强度：强'}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmKey" className="block text-sm font-medium text-gray-700 mb-1">确认新管理员密钥</label>
            <input
              type="password"
              id="confirmKey"
              value={confirmKey}
              onChange={(e) => setConfirmKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '修改密钥'}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

const AccessPasswordForm = ({ setMessage }: { setMessage: (message: { type: 'success' | 'error'; text: string } | null) => void }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return '密码长度至少为8个字符';
    }
    if (!/[A-Z]/.test(password)) {
      return '密码必须包含至少一个大写字母';
    }
    if (!/[a-z]/.test(password)) {
      return '密码必须包含至少一个小写字母';
    }
    if (!/[0-9]/.test(password)) {
      return '密码必须包含至少一个数字';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '新密码与确认密码不匹配' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/credentials/access-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: '初始访问密码更新成功' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || '更新失败，请重试' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '服务器错误，请稍后重试' });
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">修改初始访问密码</h2>
      
      {showConfirm && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">确认操作</p>
          <p>您确定要修改初始访问密码吗？此操作将影响管理员登录入口的访问权限。</p>
          <div className="mt-2 flex space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => setShowConfirm(false)}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              确认修改
            </button>
          </div>
        </div>
      )}

      {!showConfirm && (
        <>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">当前初始访问密码</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">新初始访问密码</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {newPassword && (
              <p className="mt-1 text-xs text-gray-500">
                {validatePassword(newPassword) || '密码强度：强'}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">确认新初始访问密码</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '修改密码'}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default CredentialsPage;