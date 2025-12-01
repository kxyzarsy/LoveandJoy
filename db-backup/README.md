# 数据库自动备份方案

## 1. 方案概述

本方案用于实现LoveandJoy博客系统的MySQL数据库自动备份，包括以下功能：

- ✅ 每周自动备份数据库
- ✅ 完整备份（包括表结构、数据、存储过程、触发器等）
- ✅ 备份文件压缩
- ✅ 时间戳命名
- ✅ 备份保留策略
- ✅ 备份成功/失败通知
- ✅ 过期备份自动清理

## 2. 系统要求

- Windows 10/Server 2016及以上版本
- Node.js 16及以上版本
- MySQL 8.0及以上版本
- PowerShell 5.1及以上版本

## 3. 安装与配置

### 3.1 安装依赖

1. 安装Node.js依赖：

```bash
cd d:\MyBlog\LoveandJoy\db-backup
npm install nodemailer
```

### 3.2 配置备份脚本

编辑 `backup-script.js` 文件，修改以下配置：

```javascript
// 数据库配置
const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'yueblog'
};

// 备份配置
const BACKUP_CONFIG = {
  // 备份目录
  localBackupDir: path.join(__dirname, 'backups'),
  // 异地备份目录（可选）
  remoteBackupDir: null,
  // 备份保留策略（天）
  retentionDays: {
    daily: 7,   // 每日备份保留7天
    weekly: 4,  // 每周备份保留4周
    monthly: 12 // 每月备份保留12个月
  },
  // 通知配置
  notification: {
    enable: true,
    from: 'backup@example.com',
    to: 'admin@example.com',
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'backup@example.com',
        pass: 'password'
      }
    }
  }
};
```

### 3.3 设置任务计划

使用PowerShell以管理员身份运行：

```powershell
# 运行任务计划设置脚本
cd d:\MyBlog\LoveandJoy\db-backup
.\setup-scheduled-task.ps1
```

默认配置：
- 备份时间：每周日凌晨2:00
- 运行用户：SYSTEM
- 运行级别：最高权限

自定义配置：

```powershell
.\setup-scheduled-task.ps1 -ScriptPath "d:\MyBlog\LoveandJoy\db-backup\backup-script.js" -BackupTime "03:00" -BackupDay "Monday"
```

## 4. 备份文件管理

### 4.1 备份文件命名规则

备份文件命名格式：
```
{database}_{timestamp}.sql.zip
```

示例：
```
yueblog_2025-11-30_02-00-00.sql.zip
```

### 4.2 备份保留策略

| 备份类型 | 保留时长 |
|----------|----------|
| 每日备份 | 7天 |
| 每周备份 | 4周 |
| 每月备份 | 12个月 |

### 4.3 备份文件存储

- **本地存储**：`d:\MyBlog\LoveandJoy\db-backup\backups`
- **异地存储**：可配置网络共享或FTP（需要额外设置）

## 5. 恢复测试

### 5.1 自动恢复测试脚本

本方案提供了自动恢复测试脚本，可以定期测试备份文件的恢复功能，确保备份数据的可用性和完整性。

#### 5.1.1 脚本功能

- 自动查找最新的备份文件
- 解压备份文件
- 创建临时测试数据库
- 恢复备份到测试数据库
- 验证数据完整性（检查关键表和数据量）
- 清理测试资源
- 发送恢复测试结果通知

#### 5.1.2 运行恢复测试

```bash
cd d:\MyBlog\LoveandJoy\db-backup
node restore-test-script.js
```

#### 5.1.3 配置恢复测试

编辑 `restore-test-script.js` 文件，修改以下配置：

```javascript
// 数据库配置
const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'yueblog',
  testDatabase: 'yueblog_test_restore' // 测试恢复用的临时数据库
};

// 备份配置
const BACKUP_CONFIG = {
  // 备份目录
  localBackupDir: path.join(__dirname, 'backups'),
  // 通知配置（同备份脚本）
  notification: {
    enable: true,
    from: 'backup@example.com',
    to: 'admin@example.com',
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'backup@example.com',
        pass: 'password'
      }
    }
  }
};
```

### 5.2 手动恢复测试步骤

1. 解压备份文件：
   ```powershell
   powershell Expand-Archive -Path "d:\MyBlog\LoveandJoy\db-backup\backups\yueblog_daily_2025-11-30_02-00-00.sql.zip" -DestinationPath "d:\temp"
   ```

2. 恢复数据库：
   ```bash
   mysql -h localhost -u root -p123456 yueblog < d:\temp\yueblog_daily_2025-11-30_02-00-00.sql
   ```

3. 验证数据完整性：
   ```bash
   mysql -h localhost -u root -p123456 -e "SELECT COUNT(*) FROM User;" yueblog
   ```

### 5.3 定期恢复测试

建议每月至少进行一次恢复测试，确保备份数据的可用性和完整性。可以通过以下方式设置定期恢复测试：

1. **手动执行**：每月手动运行一次恢复测试脚本
2. **任务计划**：创建一个每月运行的Windows任务计划

#### 5.3.1 设置恢复测试任务计划

```powershell
# 创建每月恢复测试任务计划
$TaskName = "数据库恢复测试 - LoveandJoy"
$Action = New-ScheduledTaskAction -Execute "node.exe" -Argument "d:\MyBlog\LoveandJoy\db-backup\restore-test-script.js" -WorkingDirectory "d:\MyBlog\LoveandJoy\db-backup"
$Trigger = New-ScheduledTaskTrigger -Monthly -DaysOfMonth 1 -At "03:00" # 每月1日凌晨3:00
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5)
Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "每月自动测试数据库备份恢复功能" -User "SYSTEM" -RunLevel Highest
```

## 6. 监控与维护

### 6.1 查看任务状态

```powershell
Get-ScheduledTask -TaskName "数据库自动备份 - LoveandJoy"
```

### 6.2 查看任务历史

```powershell
Get-WinEvent -LogName 'Microsoft-Windows-TaskScheduler/Operational' -FilterXPath "*[System[EventID=100 or EventID=101 or EventID=102 or EventID=200 or EventID=201]]" | Where-Object {$_.Properties[0].Value -eq '数据库自动备份 - LoveandJoy'}
```

### 6.3 手动运行备份

```bash
cd d:\MyBlog\LoveandJoy\db-backup
node backup-script.js
```

### 6.4 停止任务

```powershell
Stop-ScheduledTask -TaskName "数据库自动备份 - LoveandJoy"
```

### 6.5 删除任务

```powershell
Unregister-ScheduledTask -TaskName "数据库自动备份 - LoveandJoy" -Confirm:$false
```

## 7. 故障排除

### 7.1 备份失败

1. 检查MySQL服务是否运行
2. 检查数据库连接配置是否正确
3. 检查备份目录权限
4. 查看任务计划日志

### 7.2 通知邮件发送失败

1. 检查SMTP配置是否正确
2. 检查邮件服务器是否允许发送
3. 检查网络连接

### 7.3 备份文件过大

1. 考虑增加备份频率
2. 调整备份保留策略
3. 考虑使用增量备份

## 8. 异地备份策略

### 8.1 网络共享

1. 配置网络共享目录
2. 修改 `backup-script.js` 中的 `remoteBackupDir`：
   ```javascript
   remoteBackupDir: '\\remote-server\backup',
   ```

### 8.2 FTP备份

1. 安装FTP客户端：
   ```bash
   npm install ftp
   ```

2. 修改 `backup-script.js`，添加FTP上传功能

## 9. 备份策略优化

### 9.1 增量备份

对于大型数据库，可以考虑使用增量备份策略：

1. 每周日进行完整备份
2. 周一至周六进行增量备份

### 9.2 多副本备份

建议至少保留2个不同位置的备份副本：

1. 本地服务器
2. 远程服务器或云存储

### 9.3 加密备份

对于敏感数据，可以考虑对备份文件进行加密：

```powershell
# 加密备份文件
powershell Protect-CmsMessage -Path "backup.zip" -DestinationPath "backup.zip.encrypted" -To "admin@example.com"
```

## 10. 结论

本方案实现了一个完整的数据库自动备份系统，包括：

- ✅ 每周自动备份
- ✅ 完整备份所有数据库对象
- ✅ 备份文件压缩
- ✅ 时间戳命名
- ✅ 备份保留策略
- ✅ 备份通知
- ✅ 过期备份自动清理
- ✅ 异地备份支持

通过定期测试恢复功能，可以确保备份数据的可用性和完整性，为系统数据安全提供保障。