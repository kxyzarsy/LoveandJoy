/**
 * 安全日志记录工具
 * 用于记录关键操作和安全事件，支持分级存储和定期备份
 */

// 日志级别枚举
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  SECURITY = 'SECURITY', // 安全相关事件
}

// 日志类型枚举
export enum LogType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  USER_ACTION = 'USER_ACTION',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  DATA_ACCESS = 'DATA_ACCESS',
  API_CALL = 'API_CALL',
  DATABASE_OPERATION = 'DATABASE_OPERATION',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

// 安全日志接口
export interface SecurityLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  type: LogType;
  message: string;
  userId?: string;
  username?: string;
  ipAddress: string;
  userAgent?: string;
  action: string;
  resource?: string;
  status: 'SUCCESS' | 'FAILURE';
  details?: unknown;
  requestId?: string;
}

// 日志配置接口
interface LoggerConfig {
  logLevel: LogLevel;
  maxFileSize: number; // 最大文件大小（字节）
  backupCount: number; // 备份文件数量
  logDirectory: string;
  enableConsoleLogging: boolean;
  enableFileLogging: boolean;
}

// 默认配置
const DEFAULT_CONFIG: LoggerConfig = {
  logLevel: LogLevel.INFO,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  backupCount: 5,
  logDirectory: 'logs',
  enableConsoleLogging: true,
  enableFileLogging: true,
};

// 生成唯一日志ID
const generateLogId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 检查日志级别
const shouldLog = (level: LogLevel, configLevel: LogLevel): boolean => {
  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.CRITICAL, LogLevel.SECURITY];
  return levels.indexOf(level) >= levels.indexOf(configLevel);
};

// 格式化日志消息
const formatLogMessage = (log: SecurityLog): string => {
  const baseLog = `${log.timestamp} [${log.level}] [${log.type}] [${log.action}] [${log.status}]`;
  const userInfo = log.userId ? ` [User: ${log.userId} (${log.username || 'N/A'})]` : '';
  const requestInfo = log.requestId ? ` [Request: ${log.requestId}]` : '';
  const resourceInfo = log.resource ? ` [Resource: ${log.resource}]` : '';
  const ipInfo = ` [IP: ${log.ipAddress}]`;
  const details = log.details ? ` Details: ${JSON.stringify(log.details)}` : '';
  
  return `${baseLog}${userInfo}${requestInfo}${resourceInfo}${ipInfo} - ${log.message}${details}`;
};

// 安全日志记录器类
export class SecurityLogger {
  private config: LoggerConfig;
  private logQueue: SecurityLog[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  
  constructor(config?: Partial<LoggerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // 初始化日志目录
    this.initLogDirectory();
    
    // 设置定期刷新队列
    this.flushInterval = setInterval(() => {
      this.flushLogQueue();
    }, 5000); // 每5秒刷新一次
  }
  
  private initLogDirectory(): void {
    if (this.config.enableFileLogging) {
      try {
        // 只在服务器端使用fs模块
        if (typeof window === 'undefined') {
          const fs = require('fs');
          const path = require('path');
          
          const logDir = path.join(process.cwd(), this.config.logDirectory);
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
          }
        }
      } catch (error) {
        console.error('Failed to initialize log directory:', error);
      }
    }
  }
  
  // 记录日志
  public log(
    level: LogLevel,
    type: LogType,
    message: string,
    options: {
      userId?: string;
      username?: string;
      ipAddress: string;
      userAgent?: string;
      action: string;
      resource?: string;
      status: 'SUCCESS' | 'FAILURE';
      details?: unknown;
      requestId?: string;
    }
  ): void {
    if (!shouldLog(level, this.config.logLevel)) {
      return;
    }
    
    const log: SecurityLog = {
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      type,
      message,
      ...options,
    };
    
    // 添加到日志队列
    this.logQueue.push(log);
    
    // 立即输出到控制台
    if (this.config.enableConsoleLogging) {
      this.logToConsole(log);
    }
    
    // 如果是高优先级日志，立即写入文件
    if ([LogLevel.ERROR, LogLevel.CRITICAL, LogLevel.SECURITY].includes(level)) {
      this.flushLogQueue();
    }
  }
  
  // 记录控制台日志
  private logToConsole(log: SecurityLog): void {
    const formattedMessage = formatLogMessage(log);
    
    // 在Windows系统上确保中文能正确显示
    const messageToLog = formattedMessage;
    
    switch (log.level) {
      case LogLevel.DEBUG:
        console.debug(messageToLog);
        break;
      case LogLevel.INFO:
        console.info(messageToLog);
        break;
      case LogLevel.WARN:
        console.warn(messageToLog);
        break;
      case LogLevel.ERROR:
      case LogLevel.SECURITY:
        console.error(messageToLog);
        break;
      case LogLevel.CRITICAL:
        console.error('\x1b[31m' + messageToLog + '\x1b[0m'); // 红色
        break;
      default:
        console.log(messageToLog);
    }
  }
  
  // 记录文件日志
  private async logToFile(log: SecurityLog): Promise<void> {
    if (!this.config.enableFileLogging) {
      return;
    }
    
    try {
      // 只在服务器端使用fs模块
      if (typeof window === 'undefined') {
        const fs = require('fs');
        const path = require('path');
        
        // 按日期和类型分文件
        const today = new Date().toISOString().split('T')[0];
        const logFileName = `${today}-${log.type.toLowerCase()}.log`;
        const logFilePath = path.join(process.cwd(), this.config.logDirectory, logFileName);
        
        const formattedMessage = formatLogMessage(log) + '\n';
        
        // 写入文件（追加模式）
        fs.appendFileSync(logFilePath, formattedMessage, 'utf8');
        
        // 检查文件大小，超过则备份
        this.checkAndRotateLogs(logFilePath);
      }
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }
  
  // 检查并轮换日志文件
  private checkAndRotateLogs(filePath: string): void {
    try {
      // 只在服务器端使用fs模块
      if (typeof window === 'undefined') {
        const fs = require('fs');
        const path = require('path');
        
        const stats = fs.statSync(filePath);
        if (stats.size > this.config.maxFileSize) {
          // 备份当前文件
          const backupPath = `${filePath}.${Date.now()}`;
          fs.renameSync(filePath, backupPath);
          
          // 创建新文件
          fs.writeFileSync(filePath, '', 'utf8');
          
          // 清理旧备份
          this.cleanupOldBackups(path.dirname(filePath), path.basename(filePath));
        }
      }
    } catch (error) {
      console.error('Failed to rotate logs:', error);
    }
  }
  
  // 清理旧备份文件
  private cleanupOldBackups(directory: string, baseFileName: string): void {
    try {
      // 只在服务器端使用fs模块
      if (typeof window === 'undefined') {
        const fs = require('fs');
        const path = require('path');
        
        // 获取所有备份文件
        const files = fs.readdirSync(directory)
          .filter((file: string) => file.startsWith(baseFileName) && file !== baseFileName)
          .map((file: string) => path.join(directory, file))
          .sort((a: string, b: string) => {
            return fs.statSync(a).mtime.getTime() - fs.statSync(b).mtime.getTime();
          });
        
        // 删除多余的备份
        while (files.length > this.config.backupCount) {
          const oldFile = files.shift();
          if (oldFile) {
            fs.unlinkSync(oldFile);
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }
  
  // 刷新日志队列
  private flushLogQueue(): void {
    if (this.logQueue.length === 0) {
      return;
    }
    
    // 复制并清空队列
    const logsToWrite = [...this.logQueue];
    this.logQueue = [];
    
    // 写入所有日志
    logsToWrite.forEach(log => {
      this.logToFile(log).catch(error => {
        console.error('Failed to write log:', error);
      });
    });
  }
  
  // 记录认证事件
  public logAuthentication(
    message: string,
    options: {
      userId?: string;
      username?: string;
      ipAddress: string;
      userAgent?: string;
      action: string;
      status: 'SUCCESS' | 'FAILURE';
      details?: unknown;
      requestId?: string;
    }
  ): void {
    this.log(
      options.status === 'FAILURE' ? LogLevel.SECURITY : LogLevel.INFO,
      LogType.AUTHENTICATION,
      message,
      options
    );
  }
  
  // 记录授权事件
  public logAuthorization(
    message: string,
    options: {
      userId?: string;
      username?: string;
      ipAddress: string;
      userAgent?: string;
      action: string;
      resource: string;
      status: 'SUCCESS' | 'FAILURE';
      details?: unknown;
      requestId?: string;
    }
  ): void {
    this.log(
      options.status === 'FAILURE' ? LogLevel.SECURITY : LogLevel.INFO,
      LogType.AUTHORIZATION,
      message,
      options
    );
  }
  
  // 记录API调用
  public logApiCall(
    message: string,
    options: {
      userId?: string;
      username?: string;
      ipAddress: string;
      userAgent?: string;
      action: string;
      resource: string;
      status: 'SUCCESS' | 'FAILURE';
      details?: unknown;
      requestId?: string;
    }
  ): void {
    this.log(
      options.status === 'FAILURE' ? LogLevel.ERROR : LogLevel.INFO,
      LogType.API_CALL,
      message,
      options
    );
  }
  
  // 记录安全违规
  public logSecurityViolation(
    message: string,
    options: {
      userId?: string;
      username?: string;
      ipAddress: string;
      userAgent?: string;
      action: string;
      resource?: string;
      details?: unknown;
      requestId?: string;
    }
  ): void {
    this.log(
      LogLevel.SECURITY,
      LogType.SECURITY_VIOLATION,
      message,
      {
        ...options,
        status: 'FAILURE',
      }
    );
  }
  
  // 关闭日志记录器
  public close(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // 刷新剩余日志
    this.flushLogQueue();
  }
}

// 创建默认日志记录器实例
export const securityLogger = new SecurityLogger();
