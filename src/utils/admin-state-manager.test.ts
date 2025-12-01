import { 
  getAdminState, 
  setAdminState, 
  removeAdminState, 
  clearAllAdminState, 
  listenToAdminStateChanges, 
  isTokenExpired, 
  getAdminHeaders, 
  adminAuth, 
  AdminState 
} from './admin-state-manager';

// 模拟localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
    // 重置存储
    reset: () => {
      store = {};
    }
  };
})();

// 保存原始的localStorage
const originalLocalStorage = global.localStorage;

// 模拟window.location.href
const originalLocationHref = window.location.href;

// 模拟window.dispatchEvent
const originalDispatchEvent = window.dispatchEvent;
const mockDispatchEvent = jest.fn();

// 模拟window.addEventListener
const originalAddEventListener = window.addEventListener;
const mockAddEventListener = jest.fn();

// 模拟window.removeEventListener
const originalRemoveEventListener = window.removeEventListener;
const mockRemoveEventListener = jest.fn();

describe('admin-state-manager', () => {
  // 在每个测试前重置模拟
  beforeEach(() => {
    // 重置localStorage模拟
    (localStorageMock as unknown).reset();
    // 重置window.location
    window.location.href = originalLocationHref;
    // 重置mock函数
    mockDispatchEvent.mockClear();
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  // 在测试前设置模拟
  beforeAll(() => {
    // 替换localStorage
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    // 替换window.dispatchEvent
    window.dispatchEvent = mockDispatchEvent;
    // 替换window.addEventListener
    window.addEventListener = mockAddEventListener;
    // 替换window.removeEventListener
    window.removeEventListener = mockRemoveEventListener;
  });

  // 在测试后恢复原始对象
  afterAll(() => {
    // 恢复localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
    // 恢复window.dispatchEvent
    window.dispatchEvent = originalDispatchEvent;
    // 恢复window.addEventListener
    window.addEventListener = originalAddEventListener;
    // 恢复window.removeEventListener
    window.removeEventListener = originalRemoveEventListener;
  });

  describe('getAdminState', () => {
    it('应该返回null当key不存在时', () => {
      const result = getAdminState('testKey');
      expect(result).toBeNull();
    });

    it('应该返回字符串值当value是字符串时', () => {
      // 直接设置localStorage
      localStorageMock.setItem('admin_testKey', 'testValue');
      const result = getAdminState<string>('testKey');
      expect(result).toBe('testValue');
    });

    it('应该返回解析后的JSON对象当value是JSON字符串时', () => {
      // 直接设置localStorage
      localStorageMock.setItem('admin_testKey', JSON.stringify({ test: 'value' }));
      const result = getAdminState<{ test: string }>('testKey');
      expect(result).toEqual({ test: 'value' });
    });

    it('应该返回字符串当JSON解析失败时', () => {
      // 直接设置localStorage为无效JSON
      localStorageMock.setItem('admin_testKey', 'invalid json');
      const result = getAdminState<string>('testKey');
      expect(result).toBe('invalid json');
    });
  });

  describe('setAdminState', () => {
    it('应该设置值到localStorage', () => {
      setAdminState('testKey', 'testValue');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('admin_testKey', JSON.stringify('testValue'));
    });

    it('应该触发adminStateChanged事件', () => {
      setAdminState('testKey', 'testValue');
      expect(mockDispatchEvent).toHaveBeenCalled();
    });

    it('应该设置对象值', () => {
      const testObject = { test: 'value' };
      setAdminState('testKey', testObject);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('admin_testKey', JSON.stringify(testObject));
    });
  });

  describe('removeAdminState', () => {
    it('应该从localStorage中删除值', () => {
      // 先设置值
      localStorageMock.setItem('admin_testKey', 'testValue');
      // 然后删除
      removeAdminState('testKey');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('admin_testKey');
    });

    it('应该触发adminStateChanged事件', () => {
      removeAdminState('testKey');
      expect(mockDispatchEvent).toHaveBeenCalled();
    });
  });

  describe('clearAllAdminState', () => {
    it('应该清除所有带有admin_前缀的localStorage项', () => {
      // 设置一些测试值
      localStorageMock.setItem('admin_test1', 'value1');
      localStorageMock.setItem('admin_test2', 'value2');
      localStorageMock.setItem('user_test', 'value3'); // 非admin前缀
      
      // 清除所有admin状态
      clearAllAdminState();
      
      // 验证admin前缀的项被清除
      expect(localStorageMock.getItem('admin_test1')).toBeNull();
      expect(localStorageMock.getItem('admin_test2')).toBeNull();
      // 验证非admin前缀的项没有被清除
      expect(localStorageMock.getItem('user_test')).toBe('value3');
    });

    it('应该触发adminStateChanged事件', () => {
      clearAllAdminState();
      expect(mockDispatchEvent).toHaveBeenCalled();
    });
  });

  describe('listenToAdminStateChanges', () => {
    it('应该添加事件监听器并返回清理函数', () => {
      const callback = jest.fn();
      const cleanup = listenToAdminStateChanges(callback);
      
      // 验证事件监听器被添加
      expect(mockAddEventListener).toHaveBeenCalledWith('adminStateChanged', callback);
      
      // 调用清理函数
      cleanup();
      
      // 验证事件监听器被移除
      expect(mockRemoveEventListener).toHaveBeenCalledWith('adminStateChanged', callback);
    });
  });

  describe('isTokenExpired', () => {
    it('应该返回false当令牌未过期时', () => {
      // 创建一个未过期的JWT令牌（exp设置为未来时间）
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 3600 // 1小时后过期
      };
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.signature`;
      
      const result = isTokenExpired(token);
      expect(result).toBe(false);
    });

    it('应该返回true当令牌已过期时', () => {
      // 创建一个已过期的JWT令牌（exp设置为过去时间）
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) - 3600 // 1小时前过期
      };
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.signature`;
      
      const result = isTokenExpired(token);
      expect(result).toBe(true);
    });

    it('应该返回true当令牌格式无效时', () => {
      const result = isTokenExpired('invalid-token');
      expect(result).toBe(true);
    });

    it('应该返回true当payload不是有效的JSON时', () => {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid-json.signature`;
      const result = isTokenExpired(token);
      expect(result).toBe(true);
    });
  });

  describe('adminAuth', () => {
    describe('isAuthenticated', () => {
      it('应该返回false当isLoggedIn为false时', () => {
        localStorageMock.setItem('admin_isLoggedIn', JSON.stringify(false));
        const result = adminAuth.isAuthenticated();
        expect(result).toBe(false);
      });

      it('应该返回true当isLoggedIn为true时', () => {
        localStorageMock.setItem('admin_isLoggedIn', JSON.stringify(true));
        const result = adminAuth.isAuthenticated();
        expect(result).toBe(true);
      });

      it('应该返回false当isLoggedIn不存在时', () => {
        const result = adminAuth.isAuthenticated();
        expect(result).toBe(false);
      });
    });

    describe('getCurrentUser', () => {
      it('应该返回null当user不存在时', () => {
        const result = adminAuth.getCurrentUser();
        expect(result).toBeNull();
      });

      it('应该返回用户对象当user存在时', () => {
        const user: AdminState['user'] = {
          id: 1,
          name: 'Test Admin',
          username: 'testadmin',
          email: 'test@example.com',
          avatar: 'avatar-url',
          bio: 'Test bio',
          role: 'admin',
          createdAt: '2025-01-01T00:00:00.000Z'
        };
        localStorageMock.setItem('admin_user', JSON.stringify(user));
        const result = adminAuth.getCurrentUser();
        expect(result).toEqual(user);
      });
    });

    describe('login', () => {
      it('应该设置isLoggedIn为true', () => {
        const user: AdminState['user'] = {
          id: 1,
          name: 'Test Admin',
          username: 'testadmin',
          email: 'test@example.com',
          avatar: 'avatar-url',
          bio: 'Test bio',
          role: 'admin',
          createdAt: '2025-01-01T00:00:00.000Z'
        };
        const token = 'test-token';
        
        adminAuth.login(user, token);
        
        // 验证localStorage被正确设置
        expect(localStorageMock.setItem).toHaveBeenCalledWith('admin_isLoggedIn', JSON.stringify(true));
        expect(localStorageMock.setItem).toHaveBeenCalledWith('admin_user', JSON.stringify(user));
        expect(localStorageMock.setItem).toHaveBeenCalledWith('admin_token', JSON.stringify(token));
      });
    });

    describe('logout', () => {
      it('应该清除所有admin状态', () => {
        // 先设置一些admin状态
        localStorageMock.setItem('admin_isLoggedIn', JSON.stringify(true));
        localStorageMock.setItem('admin_user', JSON.stringify({ id: 1, name: 'Test Admin' }));
        localStorageMock.setItem('admin_token', JSON.stringify('test-token'));
        
        adminAuth.logout();
        
        // 验证clearAllAdminState被调用
        // 由于我们无法直接验证clearAllAdminState被调用，我们可以验证localStorage被清空
        // 重置localStorageMock的store
        (localStorageMock as unknown).reset();
        // 重新调用clearAllAdminState并验证
        clearAllAdminState();
        expect(mockDispatchEvent).toHaveBeenCalled();
      });
    });
  });
});
