# 用户操作记录脚本使用说明

## 1. 脚本概述

### 1.1 功能介绍

用户操作记录脚本是一个用于测试环境的工具，主要功能包括：

- **实时捕获**：记录用户在应用界面上的每一步交互操作
- **结构化存储**：将操作数据以结构化方式存储
- **自动化回放**：基于记录的操作数据模拟用户操作流程
- **数据导出**：将记录的操作日志以JSON格式导出
- **生命周期管理**：提供明确的启动、停止和销毁机制

### 1.2 适用场景

- 自动化测试：模拟用户操作流程进行功能测试
- 问题复现：记录并回放导致问题的操作步骤
- 性能分析：分析用户操作过程中的性能问题
- 交互优化：分析用户操作习惯，优化界面交互

### 1.3 技术特性

- 纯JavaScript实现，无需依赖其他库
- 轻量级设计，对页面性能影响小
- 支持多种操作类型：点击、右键、双击、键盘输入等
- 提供完整的生命周期管理
- 易于集成和使用

## 2. 安装与集成

### 2.1 安装方式

将 `user-operation-tracker.js` 文件复制到项目的 `public` 目录下。

### 2.2 集成方式

在需要使用脚本的页面中，通过 `<script>` 标签引入：

```html
<!-- 仅在测试环境中引入 -->
<script src="/user-operation-tracker.js"></script>
```

或者在项目的入口文件中动态引入：

```javascript
// 仅在测试环境中引入
if (process.env.NODE_ENV === 'development') {
  const script = document.createElement('script');
  script.src = '/user-operation-tracker.js';
  document.body.appendChild(script);
}
```

## 3. 使用方法

### 3.1 基本操作

脚本初始化后，会在浏览器控制台输出可用命令：

```
📊 用户操作记录脚本已初始化
📌 可用命令:
   - userOperationTracker.start() - 开始记录
   - userOperationTracker.stop() - 停止记录
   - userOperationTracker.exportData() - 导出记录数据
   - userOperationTracker.playback() - 回放记录的操作
   - userOperationTracker.clearData() - 清除记录数据
   - userOperationTracker.destroy() - 彻底销毁脚本
```

### 3.2 命令详解

#### 3.2.1 开始记录

```javascript
userOperationTracker.start();
```

开始记录用户操作，包括：
- 鼠标点击（左键、右键、双击）
- 键盘输入
- 页面加载和卸载

#### 3.2.2 停止记录

```javascript
userOperationTracker.stop();
```

停止记录用户操作，并输出记录的操作数量。

#### 3.2.3 导出数据

```javascript
userOperationTracker.exportData();
```

将记录的操作数据以JSON格式导出，文件名格式为 `user-operations-{timestamp}.json`。

#### 3.2.4 回放操作

```javascript
userOperationTracker.playback();
```

基于记录的操作数据，模拟用户操作流程进行自动化测试。

#### 3.2.5 清除数据

```javascript
userOperationTracker.clearData();
```

清除所有记录的操作数据。

#### 3.2.6 销毁脚本

```javascript
userOperationTracker.destroy();
```

彻底销毁脚本，包括：
- 停止记录
- 清除数据
- 停止回放
- 移除所有事件监听器
- 删除全局对象

## 4. 数据结构

### 4.1 导出数据格式

导出的JSON数据包含两部分：

```json
{
  "metadata": {
    "version": "1.0.0",
    "startTime": 1630000000000,
    "endTime": 1630000100000,
    "duration": 100000,
    "operationCount": 10,
    "url": "http://localhost:3000",
    "title": "测试页面"
  },
  "operations": [
    // 操作记录数组
  ]
}
```

### 4.2 操作记录格式

#### 点击操作

```json
{
  "id": 1,
  "type": "click",
  "timestamp": 1000,
  "absoluteTimestamp": 1630000001000,
  "x": 100,
  "y": 200,
  "elementPath": "div#container > button.btn-primary",
  "elementTag": "button",
  "elementId": "btn-primary",
  "elementClass": "btn btn-primary",
  "button": 0,
  "modifiers": {
    "ctrlKey": false,
    "shiftKey": false,
    "altKey": false,
    "metaKey": false
  }
}
```

#### 键盘操作

```json
{
  "id": 2,
  "type": "keydown",
  "timestamp": 2000,
  "absoluteTimestamp": 1630000002000,
  "key": "Enter",
  "keyCode": 13,
  "modifiers": {
    "ctrlKey": false,
    "shiftKey": false,
    "altKey": false,
    "metaKey": false
  }
}
```

## 5. 最佳实践

### 5.1 使用建议

1. **仅在测试环境中使用**：正式上线前必须移除脚本
2. **合理使用记录时长**：避免记录过长时间的操作，影响性能
3. **定期导出数据**：及时导出重要的操作记录
4. **使用唯一标识**：确保测试环境的数据库中使用唯一的测试数据
5. **结合其他测试工具**：与浏览器开发者工具、性能分析工具等结合使用

### 5.2 性能优化

- 避免在复杂页面上长时间记录
- 记录完成后及时停止
- 不需要的操作记录及时清除
- 测试完成后彻底销毁脚本

### 5.3 问题排查

如果遇到问题，可以通过以下方式排查：

1. 检查浏览器控制台是否有错误信息
2. 确认脚本是否正确引入
3. 检查命令是否正确执行
4. 查看导出的操作数据，分析问题原因

## 6. 生命周期管理

### 6.1 启动机制

脚本通过以下方式启动：

1. 页面加载时自动初始化
2. 调用 `userOperationTracker.start()` 开始记录

### 6.2 停止机制

脚本通过以下方式停止：

1. 调用 `userOperationTracker.stop()` 停止记录
2. 页面卸载时自动停止记录
3. 调用 `userOperationTracker.destroy()` 彻底销毁脚本

### 6.3 销毁机制

调用 `userOperationTracker.destroy()` 会：

1. 停止当前的记录
2. 清除所有操作数据
3. 停止正在进行的回放
4. 移除所有事件监听器
5. 删除全局对象

## 7. 安全与注意事项

### 7.1 安全风险

- **数据泄露**：记录的操作数据可能包含敏感信息，如用户名、密码等
- **性能影响**：长时间记录可能影响页面性能
- **兼容性问题**：某些浏览器可能不支持部分API

### 7.2 注意事项

1. **正式上线前必须删除**：确保在应用正式上线前，从代码库和部署环境中彻底删除脚本
2. **避免记录敏感信息**：在记录操作时，避免输入敏感信息
3. **定期清理数据**：及时清理不需要的操作记录
4. **仅在信任的环境中使用**：不要在生产环境或不可信的环境中使用

### 7.3 上线前检查

在应用正式上线前，必须执行以下检查：

1. 检查所有页面是否已移除脚本引入
2. 检查代码库中是否已删除脚本文件
3. 检查构建配置是否已排除脚本文件
4. 测试生产环境是否存在脚本相关的错误

## 8. 版本历史

| 版本 | 日期 | 描述 |
|------|------|------|
| 1.0.0 | 2025-11-29 | 初始版本 |

## 9. 联系与支持

如果在使用过程中遇到问题，欢迎反馈和交流。

---

**⚠️ 重要提示：本脚本仅用于测试环境，正式上线前必须彻底删除，否则可能导致安全风险和性能问题！**