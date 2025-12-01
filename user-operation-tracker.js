// 用户操作记录脚本
// 版本: 1.0.0
// 用途: 捕获、存储和回放用户操作，用于自动化测试和问题分析
// 注意: 本脚本仅用于测试环境，正式上线前必须删除

class UserOperationTracker {
  constructor() {
    this.isTracking = false;
    this.operations = [];
    this.startTime = null;
    this.eventListeners = [];
    this.playbackInterval = null;
    this.currentPlaybackIndex = 0;
    
    // 初始化脚本
    this.init();
  }
  
  // 初始化脚本
  init() {
    // 添加全局控制方法到window对象
    window.userOperationTracker = {
      start: () => this.start(),
      stop: () => this.stop(),
      exportData: () => this.exportData(),
      playback: () => this.playback(),
      clearData: () => this.clearData(),
      destroy: () => this.destroy()
    };
    
    console.log('📊 用户操作记录脚本已初始化');
    console.log('📌 可用命令:');
    console.log('   - userOperationTracker.start() - 开始记录');
    console.log('   - userOperationTracker.stop() - 停止记录');
    console.log('   - userOperationTracker.exportData() - 导出记录数据');
    console.log('   - userOperationTracker.playback() - 回放记录的操作');
    console.log('   - userOperationTracker.clearData() - 清除记录数据');
    console.log('   - userOperationTracker.destroy() - 彻底销毁脚本');
  }
  
  // 开始记录
  start() {
    if (this.isTracking) {
      console.log('⚠️  记录已经在进行中');
      return;
    }
    
    this.isTracking = true;
    this.startTime = Date.now();
    this.operations = [];
    
    // 添加事件监听器
    this.addEventListeners();
    
    console.log('✅ 开始记录用户操作');
  }
  
  // 停止记录
  stop() {
    if (!this.isTracking) {
      console.log('⚠️  记录已经停止');
      return;
    }
    
    this.isTracking = false;
    
    // 移除事件监听器
    this.removeEventListeners();
    
    console.log('✅ 停止记录用户操作');
    console.log(`📋 共记录了 ${this.operations.length} 个操作`);
  }
  
  // 添加事件监听器
  addEventListeners() {
    // 鼠标点击事件
    const clickHandler = (e) => this.handleMouseClick(e);
    document.addEventListener('click', clickHandler);
    this.eventListeners.push({ event: 'click', handler: clickHandler });
    
    // 右键点击事件
    const contextMenuHandler = (e) => this.handleContextMenu(e);
    document.addEventListener('contextmenu', contextMenuHandler);
    this.eventListeners.push({ event: 'contextmenu', handler: contextMenuHandler });
    
    // 双击事件
    const dblClickHandler = (e) => this.handleDoubleClick(e);
    document.addEventListener('dblclick', dblClickHandler);
    this.eventListeners.push({ event: 'dblclick', handler: dblClickHandler });
    
    // 键盘事件
    const keydownHandler = (e) => this.handleKeydown(e);
    document.addEventListener('keydown', keydownHandler);
    this.eventListeners.push({ event: 'keydown', handler: keydownHandler });
    
    // 页面加载完成事件
    const loadHandler = () => this.handlePageLoad();
    window.addEventListener('load', loadHandler);
    this.eventListeners.push({ event: 'load', handler: loadHandler });
    
    // 页面卸载事件
    const unloadHandler = () => this.handlePageUnload();
    window.addEventListener('unload', unloadHandler);
    this.eventListeners.push({ event: 'unload', handler: unloadHandler });
  }
  
  // 移除事件监听器
  removeEventListeners() {
    this.eventListeners.forEach(({ event, handler }) => {
      document.removeEventListener(event, handler);
      window.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }
  
  // 获取元素的DOM路径
  getElementPath(element) {
    if (!element || element === document) {
      return 'document';
    }
    
    if (element === window) {
      return 'window';
    }
    
    let path = '';
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.tagName.toLowerCase();
      
      // 添加ID选择器
      if (current.id) {
        selector += `#${current.id}`;
        path = `${selector} > ${path}`;
        break;
      }
      
      // 添加class选择器
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).join('.');
        selector += `.${classes}`;
      }
      
      // 添加索引
      const siblings = current.parentNode.children;
      let index = 0;
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === current) {
          index = i + 1;
          break;
        }
      }
      
      if (siblings.length > 1) {
        selector += `:nth-child(${index})`;
      }
      
      path = `${selector} > ${path}`;
      current = current.parentNode;
    }
    
    return path.replace(/ > $/, '');
  }
  
  // 处理鼠标点击事件
  handleMouseClick(e) {
    if (!this.isTracking) return;
    
    const operation = {
      id: this.operations.length + 1,
      type: 'click',
      timestamp: Date.now() - this.startTime,
      absoluteTimestamp: Date.now(),
      x: e.clientX,
      y: e.clientY,
      elementPath: this.getElementPath(e.target),
      elementTag: e.target.tagName.toLowerCase(),
      elementId: e.target.id,
      elementClass: e.target.className,
      button: e.button,
      modifiers: {
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey
      }
    };
    
    this.operations.push(operation);
    console.log('📌 记录点击操作:', operation);
  }
  
  // 处理右键点击事件
  handleContextMenu(e) {
    if (!this.isTracking) return;
    
    const operation = {
      id: this.operations.length + 1,
      type: 'contextmenu',
      timestamp: Date.now() - this.startTime,
      absoluteTimestamp: Date.now(),
      x: e.clientX,
      y: e.clientY,
      elementPath: this.getElementPath(e.target),
      elementTag: e.target.tagName.toLowerCase(),
      elementId: e.target.id,
      elementClass: e.target.className,
      modifiers: {
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey
      }
    };
    
    this.operations.push(operation);
    console.log('📌 记录右键点击操作:', operation);
  }
  
  // 处理双击事件
  handleDoubleClick(e) {
    if (!this.isTracking) return;
    
    const operation = {
      id: this.operations.length + 1,
      type: 'dblclick',
      timestamp: Date.now() - this.startTime,
      absoluteTimestamp: Date.now(),
      x: e.clientX,
      y: e.clientY,
      elementPath: this.getElementPath(e.target),
      elementTag: e.target.tagName.toLowerCase(),
      elementId: e.target.id,
      elementClass: e.target.className,
      modifiers: {
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey
      }
    };
    
    this.operations.push(operation);
    console.log('📌 记录双击操作:', operation);
  }
  
  // 处理键盘事件
  handleKeydown(e) {
    if (!this.isTracking) return;
    
    const operation = {
      id: this.operations.length + 1,
      type: 'keydown',
      timestamp: Date.now() - this.startTime,
      absoluteTimestamp: Date.now(),
      key: e.key,
      keyCode: e.keyCode,
      modifiers: {
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey
      }
    };
    
    this.operations.push(operation);
    console.log('📌 记录键盘操作:', operation);
  }
  
  // 处理页面加载事件
  handlePageLoad() {
    if (!this.isTracking) return;
    
    const operation = {
      id: this.operations.length + 1,
      type: 'pageload',
      timestamp: Date.now() - this.startTime,
      absoluteTimestamp: Date.now(),
      url: window.location.href,
      title: document.title
    };
    
    this.operations.push(operation);
    console.log('📌 记录页面加载操作:', operation);
  }
  
  // 处理页面卸载事件
  handlePageUnload() {
    if (!this.isTracking) return;
    
    const operation = {
      id: this.operations.length + 1,
      type: 'pageunload',
      timestamp: Date.now() - this.startTime,
      absoluteTimestamp: Date.now(),
      url: window.location.href
    };
    
    this.operations.push(operation);
    console.log('📌 记录页面卸载操作:', operation);
    
    // 自动停止记录
    this.stop();
    // 自动导出数据
    this.exportData();
  }
  
  // 模拟用户操作
  simulateOperation(operation) {
    console.log('🎬 模拟操作:', operation);
    
    switch (operation.type) {
      case 'click':
      case 'contextmenu':
      case 'dblclick':
        this.simulateMouseOperation(operation);
        break;
      case 'keydown':
        this.simulateKeyOperation(operation);
        break;
      default:
        console.log('⚠️  不支持的操作类型:', operation.type);
    }
  }
  
  // 模拟鼠标操作
  simulateMouseOperation(operation) {
    // 获取目标元素
    let targetElement = null;
    try {
      // 尝试通过CSS选择器获取元素
      targetElement = document.querySelector(operation.elementPath);
    } catch (error) {
      console.error('❌ 获取元素失败:', error);
    }
    
    if (!targetElement) {
      // 如果通过CSS选择器获取失败，尝试通过坐标获取元素
      targetElement = document.elementFromPoint(operation.x, operation.y);
    }
    
    if (!targetElement) {
      console.error('❌ 无法找到目标元素:', operation.elementPath);
      return;
    }
    
    // 创建鼠标事件
    const mouseEvent = new MouseEvent(operation.type, {
      bubbles: true,
      cancelable: true,
      clientX: operation.x,
      clientY: operation.y,
      button: operation.button || 0,
      ctrlKey: operation.modifiers?.ctrlKey || false,
      shiftKey: operation.modifiers?.shiftKey || false,
      altKey: operation.modifiers?.altKey || false,
      metaKey: operation.modifiers?.metaKey || false
    });
    
    // 触发事件
    targetElement.dispatchEvent(mouseEvent);
  }
  
  // 模拟键盘操作
  simulateKeyOperation(operation) {
    // 创建键盘事件
    const keyboardEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: operation.key,
      keyCode: operation.keyCode,
      ctrlKey: operation.modifiers?.ctrlKey || false,
      shiftKey: operation.modifiers?.shiftKey || false,
      altKey: operation.modifiers?.altKey || false,
      metaKey: operation.modifiers?.metaKey || false
    });
    
    // 触发事件
    document.dispatchEvent(keyboardEvent);
  }
  
  // 回放操作
  playback() {
    if (this.operations.length === 0) {
      console.log('⚠️  没有可回放的操作记录');
      return;
    }
    
    console.log(`🎬 开始回放 ${this.operations.length} 个操作`);
    this.currentPlaybackIndex = 0;
    
    // 停止当前可能正在进行的回放
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
    }
    
    // 开始回放
    let previousTimestamp = 0;
    this.playbackInterval = setInterval(() => {
      if (this.currentPlaybackIndex >= this.operations.length) {
        // 回放完成
        clearInterval(this.playbackInterval);
        this.playbackInterval = null;
        console.log('🎉 操作回放完成');
        return;
      }
      
      const operation = this.operations[this.currentPlaybackIndex];
      
      // 模拟操作
      this.simulateOperation(operation);
      
      // 更新索引
      this.currentPlaybackIndex++;
      previousTimestamp = operation.timestamp;
    }, 100); // 每100ms回放一个操作
  }
  
  // 导出数据
  exportData() {
    if (this.operations.length === 0) {
      console.log('⚠️  没有可导出的操作记录');
      return null;
    }
    
    const exportData = {
      metadata: {
        version: '1.0.0',
        startTime: this.startTime,
        endTime: Date.now(),
        duration: Date.now() - this.startTime,
        operationCount: this.operations.length,
        url: window.location.href,
        title: document.title
      },
      operations: this.operations
    };
    
    // 转换为JSON字符串
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // 创建下载链接
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-operations-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📥 操作数据已导出');
    return exportData;
  }
  
  // 清除数据
  clearData() {
    this.operations = [];
    this.startTime = null;
    console.log('🗑️  操作记录已清除');
  }
  
  // 销毁脚本
  destroy() {
    // 停止记录
    this.stop();
    
    // 清除数据
    this.clearData();
    
    // 停止回放
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
    
    // 移除全局对象
    if (window.userOperationTracker) {
      delete window.userOperationTracker;
    }
    
    console.log('🔴 用户操作记录脚本已彻底销毁');
  }
  
  // 获取脚本状态
  getStatus() {
    return {
      isTracking: this.isTracking,
      operationCount: this.operations.length,
      startTime: this.startTime,
      isPlaying: !!this.playbackInterval,
      currentPlaybackIndex: this.currentPlaybackIndex
    };
  }
}

// 初始化脚本
const tracker = new UserOperationTracker();

// 自动启动记录（可选，根据需要开启）
// tracker.start();

// 暴露脚本实例（可选）
window._userOperationTrackerInstance = tracker;