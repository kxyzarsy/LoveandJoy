// 管理员页面专用状态管理工具
// 键名前缀，避免与用户页面状态冲突
const ADMIN_STATE_PREFIX = 'admin_';

// 管理员状态类型
export interface AdminState {
  isLoggedIn: boolean;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    role: 'admin' | 'user';
    createdAt: string;
  };
  token: string;
  [key: string]: unknown;
};

// 获取管理员状态
export const getAdminState = <T = unknown>(key: string): T | null => {
  try {
    const fullKey = `${ADMIN_STATE_PREFIX}${key}`;
    const value = localStorage.getItem(fullKey);
    if (!value) return null;
    
    // 尝试解析为 JSON，如果失败则直接返回字符串
    try {
      return JSON.parse(value) as T;
    } catch (parseError) {
      // 如果解析失败，直接返回字符串值，不进行类型转换
      return value as unknown as T;
    }
  } catch (error) {
    console.error('获取管理员状态失败:', error);
    return null;
  }
};

// 设置管理员状态
export const setAdminState = (key: string, value: unknown): void => {
  try {
    const fullKey = `${ADMIN_STATE_PREFIX}${key}`;
    localStorage.setItem(fullKey, JSON.stringify(value));
    // 触发自定义事件，通知其他组件状态已更新
    window.dispatchEvent(new Event('adminStateChanged'));
  } catch (error) {
    console.error('设置管理员状态失败:', error);
  }
};

// 删除管理员状态
export const removeAdminState = (key: string): void => {
  try {
    const fullKey = `${ADMIN_STATE_PREFIX}${key}`;
    localStorage.removeItem(fullKey);
    // 触发自定义事件，通知其他组件状态已更新
    window.dispatchEvent(new Event('adminStateChanged'));
  } catch (error) {
    console.error('删除管理员状态失败:', error);
  }
};

// 清除所有管理员状态
export const clearAllAdminState = (): void => {
  try {
    // 遍历所有localStorage项，删除带有管理员前缀的项
    // 从后往前遍历，避免删除元素后索引变化导致跳过某些项
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ADMIN_STATE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    // 触发自定义事件，通知其他组件状态已更新
    window.dispatchEvent(new Event('adminStateChanged'));
  } catch (error) {
    console.error('清除所有管理员状态失败:', error);
  }
};

// 监听管理员状态变化
export const listenToAdminStateChanges = (callback: () => void): (() => void) => {
  window.addEventListener('adminStateChanged', callback);
  return () => {
    window.removeEventListener('adminStateChanged', callback);
  };
};

// 检查令牌是否过期
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // 转换为毫秒
    return Date.now() > expiry;
  } catch (error) {
    // 如果解析失败，认为令牌已过期
    return true;
  }
};

// 获取管理员请求头，包含Authorization令牌
export const getAdminHeaders = (): HeadersInit => {
  let token = getAdminState<string>('token');
  
  // 如果令牌是带引号的字符串，去除引号
  if (token && (token.startsWith('"') && token.endsWith('"'))) {
    token = token.slice(1, -1);
  }
  
  // 检查令牌是否过期
  if (token && isTokenExpired(token)) {
    // 令牌过期，清除状态
    clearAllAdminState();
    // 触发状态变化事件
    window.dispatchEvent(new Event('adminStateChanged'));
    // 重定向到登录页面
    window.location.href = '/admin/secret-login';
    return {
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// 管理员登录状态管理
export const adminAuth = {
  // 检查管理员是否已登录
  isAuthenticated: (): boolean => {
    return getAdminState<boolean>('isLoggedIn') === true;
  },
  
  // 获取当前登录的管理员用户
  getCurrentUser: (): AdminState['user'] | null => {
    return getAdminState<AdminState['user']>('user');
  },
  
  // 管理员登录
  login: (user: AdminState['user'], token: string): void => {
    console.log('Admin token from API:', token);
    
    setAdminState('isLoggedIn', true);
    setAdminState('user', user);
    setAdminState('token', token);
    
    // 验证令牌是否正确存储
    const storedToken = getAdminState<string>('token');
    console.log('Stored admin token:', storedToken);
  },
  
  // 管理员登出
  logout: (): void => {
    clearAllAdminState();
  }
};
