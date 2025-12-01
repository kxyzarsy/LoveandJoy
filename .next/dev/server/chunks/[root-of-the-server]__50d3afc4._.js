module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/bcrypt [external] (bcrypt, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("bcrypt", () => require("bcrypt"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/src/lib/db-pool.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closePool",
    ()=>closePool,
    "default",
    ()=>__TURBOPACK__default__export__,
    "executeQuery",
    ()=>executeQuery,
    "executeTransaction",
    ()=>executeTransaction,
    "getConnection",
    ()=>getConnection,
    "getPoolStatus",
    ()=>getPoolStatus,
    "releaseConnection",
    ()=>releaseConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
// 数据库连接配置
const DB_CONFIG = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'yueblog',
    // 连接池配置
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true,
    connectTimeout: 10000,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30000 // TCP KeepAlive初始延迟（毫秒）
};
// 创建数据库连接池
const pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(DB_CONFIG);
const getConnection = async ()=>{
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('获取数据库连接失败:', error);
        throw error;
    }
};
const releaseConnection = (connection)=>{
    try {
        connection.release();
    } catch (error) {
        console.error('释放数据库连接失败:', error);
    }
};
const executeQuery = async (sql, values)=>{
    let connection = null;
    try {
        connection = await getConnection();
        const result = await connection.execute(sql, values);
        return result;
    } catch (error) {
        console.error('执行SQL查询失败:', error);
        throw error;
    } finally{
        if (connection) {
            releaseConnection(connection);
        }
    }
};
const executeTransaction = async (callback)=>{
    let connection = null;
    try {
        connection = await getConnection();
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('执行事务失败:', error);
        throw error;
    } finally{
        if (connection) {
            releaseConnection(connection);
        }
    }
};
const getPoolStatus = async ()=>{
    try {
        // 由于mysql2连接池的私有属性无法直接访问，我们返回配置的连接参数
        return {
            size: DB_CONFIG.connectionLimit,
            used: 0,
            free: DB_CONFIG.connectionLimit,
            pending: 0 // 无法直接获取，返回0
        };
    } catch (error) {
        console.error('获取连接池状态失败:', error);
        return {
            size: 0,
            used: 0,
            free: 0,
            pending: 0
        };
    }
};
const closePool = async ()=>{
    try {
        await pool.end();
        console.log('数据库连接池已关闭');
    } catch (error) {
        console.error('关闭连接池失败:', error);
        throw error;
    }
};
const __TURBOPACK__default__export__ = pool;
}),
"[project]/src/utils/error-handler.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 统一错误处理工具
 * 用于在整个应用中实现一致的错误捕获、处理和返回机制
 */ // 基础错误代码枚举
__turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "ErrorCode",
    ()=>ErrorCode,
    "createErrorResponse",
    ()=>createErrorResponse,
    "handleApiError",
    ()=>handleApiError,
    "handleDatabaseError",
    ()=>handleDatabaseError,
    "handleValidationError",
    ()=>handleValidationError
]);
var ErrorCode = /*#__PURE__*/ function(ErrorCode) {
    // 通用错误
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["CONFLICT"] = "CONFLICT";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    ErrorCode["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    ErrorCode["UNPROCESSABLE_ENTITY"] = "UNPROCESSABLE_ENTITY";
    ErrorCode["TOO_MANY_REQUESTS"] = "TOO_MANY_REQUESTS";
    // 认证相关
    ErrorCode["AUTHENTICATION_ERROR"] = "AUTHENTICATION_ERROR";
    ErrorCode["AUTHORIZATION_ERROR"] = "AUTHORIZATION_ERROR";
    ErrorCode["TOKEN_ERROR"] = "TOKEN_ERROR";
    ErrorCode["SESSION_ERROR"] = "SESSION_ERROR";
    // 数据库相关
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCode["TRANSACTION_ERROR"] = "TRANSACTION_ERROR";
    ErrorCode["CONSTRAINT_ERROR"] = "CONSTRAINT_ERROR";
    ErrorCode["FOREIGN_KEY_ERROR"] = "FOREIGN_KEY_ERROR";
    ErrorCode["UNIQUE_CONSTRAINT_ERROR"] = "UNIQUE_CONSTRAINT_ERROR";
    // 业务相关
    ErrorCode["USER_ERROR"] = "USER_ERROR";
    ErrorCode["POST_ERROR"] = "POST_ERROR";
    ErrorCode["CATEGORY_ERROR"] = "CATEGORY_ERROR";
    ErrorCode["COMMENT_ERROR"] = "COMMENT_ERROR";
    // 安全相关
    ErrorCode["SECURITY_ERROR"] = "SECURITY_ERROR";
    ErrorCode["VALIDATION_FAILED"] = "VALIDATION_FAILED";
    return ErrorCode;
}({});
class AppError extends Error {
    code;
    details;
    requestId;
    constructor(code, message, details, requestId){
        super(message), this.code = code, this.details = details, this.requestId = requestId;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
// 生成唯一请求ID
const generateRequestId = ()=>{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
const createErrorResponse = (error, requestId)=>{
    const timestamp = new Date().toISOString();
    const reqId = requestId || generateRequestId();
    if (error instanceof AppError) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
                timestamp,
                requestId: error.requestId || reqId
            }
        };
    }
    // 处理未知错误
    return {
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || 'An unexpected error occurred',
            details: ("TURBOPACK compile-time truthy", 1) ? error.stack : "TURBOPACK unreachable",
            timestamp,
            requestId: reqId
        }
    };
};
const handleApiError = async (fn, requestId)=>{
    try {
        return await fn();
    } catch (error) {
        const errorResponse = createErrorResponse(error, requestId);
        // 根据错误代码设置HTTP状态码
        const statusCode = getStatusCodeForError(errorResponse.error.code);
        return new Response(JSON.stringify(errorResponse), {
            status: statusCode,
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': errorResponse.error.requestId
            }
        });
    }
};
// 获取错误对应的HTTP状态码
const getStatusCodeForError = (code)=>{
    const statusMap = {
        ["BAD_REQUEST"]: 400,
        ["NOT_FOUND"]: 404,
        ["UNAUTHORIZED"]: 401,
        ["FORBIDDEN"]: 403,
        ["CONFLICT"]: 409,
        ["VALIDATION_ERROR"]: 400,
        ["VALIDATION_FAILED"]: 400,
        ["NETWORK_ERROR"]: 503,
        ["TIMEOUT_ERROR"]: 504,
        ["SERVICE_UNAVAILABLE"]: 503,
        ["RATE_LIMIT_EXCEEDED"]: 429,
        ["UNPROCESSABLE_ENTITY"]: 422,
        ["TOO_MANY_REQUESTS"]: 429,
        ["AUTHENTICATION_ERROR"]: 401,
        ["AUTHORIZATION_ERROR"]: 403,
        ["TOKEN_ERROR"]: 401,
        ["SESSION_ERROR"]: 401,
        ["DATABASE_ERROR"]: 500,
        ["TRANSACTION_ERROR"]: 500,
        ["CONSTRAINT_ERROR"]: 400,
        ["FOREIGN_KEY_ERROR"]: 400,
        ["UNIQUE_CONSTRAINT_ERROR"]: 409,
        ["USER_ERROR"]: 400,
        ["POST_ERROR"]: 400,
        ["CATEGORY_ERROR"]: 400,
        ["COMMENT_ERROR"]: 400,
        ["SECURITY_ERROR"]: 403,
        ["INTERNAL_SERVER_ERROR"]: 500
    };
    return statusMap[code] || 500;
};
const handleValidationError = (errors)=>{
    return new AppError("VALIDATION_ERROR", 'Validation failed', {
        errors
    });
};
const handleDatabaseError = (error)=>{
    let code = "DATABASE_ERROR";
    let message = 'Database operation failed';
    // 根据错误信息识别具体错误类型
    if (error.code) {
        switch(error.code){
            case 'ER_DUP_ENTRY':
                code = "UNIQUE_CONSTRAINT_ERROR";
                message = 'Duplicate entry';
                break;
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_ROW_IS_REFERENCED_2':
                code = "FOREIGN_KEY_ERROR";
                message = 'Foreign key constraint violation';
                break;
            case 'ER_BAD_NULL_ERROR':
                code = "CONSTRAINT_ERROR";
                message = 'Not null constraint violation';
                break;
            default:
                break;
        }
    }
    return new AppError(code, message, ("TURBOPACK compile-time truthy", 1) ? error : "TURBOPACK unreachable");
};
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/utils/security-logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 安全日志记录工具
 * 用于记录关键操作和安全事件，支持分级存储和定期备份
 */ // 日志级别枚举
__turbopack_context__.s([
    "LogLevel",
    ()=>LogLevel,
    "LogType",
    ()=>LogType,
    "SecurityLogger",
    ()=>SecurityLogger,
    "securityLogger",
    ()=>securityLogger
]);
var LogLevel = /*#__PURE__*/ function(LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["CRITICAL"] = "CRITICAL";
    LogLevel["SECURITY"] = "SECURITY";
    return LogLevel;
}({});
var LogType = /*#__PURE__*/ function(LogType) {
    LogType["AUTHENTICATION"] = "AUTHENTICATION";
    LogType["AUTHORIZATION"] = "AUTHORIZATION";
    LogType["USER_ACTION"] = "USER_ACTION";
    LogType["SYSTEM_EVENT"] = "SYSTEM_EVENT";
    LogType["SECURITY_VIOLATION"] = "SECURITY_VIOLATION";
    LogType["DATA_ACCESS"] = "DATA_ACCESS";
    LogType["API_CALL"] = "API_CALL";
    LogType["DATABASE_OPERATION"] = "DATABASE_OPERATION";
    LogType["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    return LogType;
}({});
// 默认配置
const DEFAULT_CONFIG = {
    logLevel: "INFO",
    maxFileSize: 10 * 1024 * 1024,
    backupCount: 5,
    logDirectory: 'logs',
    enableConsoleLogging: true,
    enableFileLogging: true
};
// 生成唯一日志ID
const generateLogId = ()=>{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
// 检查日志级别
const shouldLog = (level, configLevel)=>{
    const levels = [
        "DEBUG",
        "INFO",
        "WARN",
        "ERROR",
        "CRITICAL",
        "SECURITY"
    ];
    return levels.indexOf(level) >= levels.indexOf(configLevel);
};
// 格式化日志消息
const formatLogMessage = (log)=>{
    const baseLog = `${log.timestamp} [${log.level}] [${log.type}] [${log.action}] [${log.status}]`;
    const userInfo = log.userId ? ` [User: ${log.userId} (${log.username || 'N/A'})]` : '';
    const requestInfo = log.requestId ? ` [Request: ${log.requestId}]` : '';
    const resourceInfo = log.resource ? ` [Resource: ${log.resource}]` : '';
    const ipInfo = ` [IP: ${log.ipAddress}]`;
    const details = log.details ? ` Details: ${JSON.stringify(log.details)}` : '';
    return `${baseLog}${userInfo}${requestInfo}${resourceInfo}${ipInfo} - ${log.message}${details}`;
};
class SecurityLogger {
    config;
    logQueue = [];
    flushInterval = null;
    constructor(config){
        this.config = {
            ...DEFAULT_CONFIG,
            ...config
        };
        // 初始化日志目录
        this.initLogDirectory();
        // 设置定期刷新队列
        this.flushInterval = setInterval(()=>{
            this.flushLogQueue();
        }, 5000); // 每5秒刷新一次
    }
    initLogDirectory() {
        if (this.config.enableFileLogging) {
            try {
                // 只在服务器端使用fs模块
                if ("TURBOPACK compile-time truthy", 1) {
                    const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
                    const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
                    const logDir = path.join(process.cwd(), this.config.logDirectory);
                    if (!fs.existsSync(logDir)) {
                        fs.mkdirSync(logDir, {
                            recursive: true
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to initialize log directory:', error);
            }
        }
    }
    // 记录日志
    log(level, type, message, options) {
        if (!shouldLog(level, this.config.logLevel)) {
            return;
        }
        const log = {
            id: generateLogId(),
            timestamp: new Date().toISOString(),
            level,
            type,
            message,
            ...options
        };
        // 添加到日志队列
        this.logQueue.push(log);
        // 立即输出到控制台
        if (this.config.enableConsoleLogging) {
            this.logToConsole(log);
        }
        // 如果是高优先级日志，立即写入文件
        if ([
            "ERROR",
            "CRITICAL",
            "SECURITY"
        ].includes(level)) {
            this.flushLogQueue();
        }
    }
    // 记录控制台日志
    logToConsole(log) {
        const formattedMessage = formatLogMessage(log);
        switch(log.level){
            case "DEBUG":
                console.debug(formattedMessage);
                break;
            case "INFO":
                console.info(formattedMessage);
                break;
            case "WARN":
                console.warn(formattedMessage);
                break;
            case "ERROR":
            case "SECURITY":
                console.error(formattedMessage);
                break;
            case "CRITICAL":
                console.error('\x1b[31m' + formattedMessage + '\x1b[0m'); // 红色
                break;
            default:
                console.log(formattedMessage);
        }
    }
    // 记录文件日志
    async logToFile(log) {
        if (!this.config.enableFileLogging) {
            return;
        }
        try {
            // 只在服务器端使用fs模块
            if ("TURBOPACK compile-time truthy", 1) {
                const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
                const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
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
    checkAndRotateLogs(filePath) {
        try {
            // 只在服务器端使用fs模块
            if ("TURBOPACK compile-time truthy", 1) {
                const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
                const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
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
    cleanupOldBackups(directory, baseFileName) {
        try {
            // 只在服务器端使用fs模块
            if ("TURBOPACK compile-time truthy", 1) {
                const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
                const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
                // 获取所有备份文件
                const files = fs.readdirSync(directory).filter((file)=>file.startsWith(baseFileName) && file !== baseFileName).map((file)=>path.join(directory, file)).sort((a, b)=>{
                    return fs.statSync(a).mtime.getTime() - fs.statSync(b).mtime.getTime();
                });
                // 删除多余的备份
                while(files.length > this.config.backupCount){
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
    flushLogQueue() {
        if (this.logQueue.length === 0) {
            return;
        }
        // 复制并清空队列
        const logsToWrite = [
            ...this.logQueue
        ];
        this.logQueue = [];
        // 写入所有日志
        logsToWrite.forEach((log)=>{
            this.logToFile(log).catch((error)=>{
                console.error('Failed to write log:', error);
            });
        });
    }
    // 记录认证事件
    logAuthentication(message, options) {
        this.log(options.status === 'FAILURE' ? "SECURITY" : "INFO", "AUTHENTICATION", message, options);
    }
    // 记录授权事件
    logAuthorization(message, options) {
        this.log(options.status === 'FAILURE' ? "SECURITY" : "INFO", "AUTHORIZATION", message, options);
    }
    // 记录API调用
    logApiCall(message, options) {
        this.log(options.status === 'FAILURE' ? "ERROR" : "INFO", "API_CALL", message, options);
    }
    // 记录安全违规
    logSecurityViolation(message, options) {
        this.log("SECURITY", "SECURITY_VIOLATION", message, {
            ...options,
            status: 'FAILURE'
        });
    }
    // 关闭日志记录器
    close() {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
            this.flushInterval = null;
        }
        // 刷新剩余日志
        this.flushLogQueue();
    }
}
const securityLogger = new SecurityLogger();
}),
"[project]/src/app/api/users/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$pool$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db-pool.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/error-handler.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$security$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/security-logger.ts [app-route] (ecmascript)");
;
;
;
;
;
;
// 用户创建请求的输入验证schema
const createUserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, '用户名不能为空'),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('请输入有效的邮箱地址'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(6, '密码长度不能少于6个字符'),
    usernameId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, '用户名ID不能为空'),
    avatar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    bio: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('user')
});
async function GET(request) {
    // 获取客户端IP
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleApiError"])(async ()=>{
        const url = new URL(request.url);
        const usernameId = url.searchParams.get('usernameId');
        let query = '';
        let params = [];
        if (usernameId) {
            // 根据usernameId查询特定用户
            query = 'SELECT id, name, email, usernameId, avatar, backgroundImage, bio, role, inactive, createdAt, updatedAt FROM user WHERE usernameId = ?';
            params = [
                usernameId
            ];
        } else {
            // 获取所有用户
            query = 'SELECT id, name, email, usernameId, avatar, backgroundImage, bio, role, inactive, createdAt, updatedAt FROM user';
        }
        const [rows] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$pool$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(query, params);
        // 计算每个用户的剩余用户名修改时间
        const usersWithRemainingTime = rows.map((user)=>{
            let remainingHours = 0;
            if (user.lastUsernameChange) {
                const lastChangeTime = new Date(user.lastUsernameChange);
                const now = new Date();
                const diffHours = (now.getTime() - lastChangeTime.getTime()) / (1000 * 60 * 60);
                remainingHours = Math.max(0, Math.ceil(720 - diffHours));
            }
            return {
                ...user,
                remainingUsernameChangeHours: remainingHours
            };
        });
        // 记录API调用日志
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$security$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["securityLogger"].logApiCall(usernameId ? '根据用户名ID获取用户成功' : '获取所有用户成功', {
            ipAddress,
            action: 'GET',
            resource: '/api/users',
            status: 'SUCCESS',
            details: usernameId ? {
                usernameId
            } : {
                count: usersWithRemainingTime.length
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(usersWithRemainingTime, {
            status: 200
        });
    });
}
async function POST(request) {
    // 获取客户端IP
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleApiError"])(async ()=>{
        const body = await request.json();
        // 使用zod验证请求参数
        const validatedData = createUserSchema.parse(body);
        const { name, email, password, usernameId, avatar, bio, role } = validatedData;
        // 检查用户名ID是否已存在
        const [existingUserRows] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$pool$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])('SELECT id FROM user WHERE usernameId = ?', [
            usernameId
        ]);
        if (existingUserRows.length > 0) {
            // 记录安全日志
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$security$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["securityLogger"].logSecurityViolation('用户名ID已存在', {
                ipAddress,
                action: 'CREATE_USER',
                resource: '/api/users',
                details: {
                    usernameId,
                    email
                }
            });
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorCode"].CONFLICT, '用户名ID已存在', {
                message: '该用户名ID已被其他用户使用，请选择其他ID'
            });
        }
        // 检查邮箱是否已存在
        const [existingEmailRows] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$pool$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])('SELECT id FROM user WHERE email = ?', [
            email
        ]);
        if (existingEmailRows.length > 0) {
            // 记录安全日志
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$security$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["securityLogger"].logSecurityViolation('邮箱已存在', {
                ipAddress,
                action: 'CREATE_USER',
                resource: '/api/users',
                details: {
                    email
                }
            });
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorCode"].CONFLICT, '邮箱已存在', {
                message: '该邮箱已被其他用户使用，请选择其他邮箱'
            });
        }
        // 加密密码
        const hashedPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$29$__["default"].hash(password, 10);
        const [result] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$pool$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])('INSERT INTO user (name, email, password, usernameId, avatar, bio, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())', [
            name,
            email,
            hashedPassword,
            usernameId,
            avatar || null,
            bio || null,
            role
        ]);
        const [newUser] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$pool$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])('SELECT id, name, email, usernameId, avatar, backgroundImage, bio, role, inactive, createdAt, updatedAt FROM user WHERE id = ?', [
            result.insertId
        ]);
        const createdUser = newUser[0];
        // 记录用户创建日志
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$security$2d$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["securityLogger"].logApiCall('创建用户成功', {
            ipAddress,
            action: 'CREATE_USER',
            resource: '/api/users',
            status: 'SUCCESS',
            details: {
                userId: createdUser.id,
                username: createdUser.name,
                email: createdUser.email
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...createdUser,
            remainingUsernameChangeHours: 0 // 新用户可以立即修改用户名ID
        }, {
            status: 201
        });
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__50d3afc4._.js.map