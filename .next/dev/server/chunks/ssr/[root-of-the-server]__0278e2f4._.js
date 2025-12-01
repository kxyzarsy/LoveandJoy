module.exports = [
"[project]/src/utils/error-handler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/utils/security-logger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
                const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
                const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
                const logDir = path.join(process.cwd(), this.config.logDirectory);
                if (!fs.existsSync(logDir)) {
                    fs.mkdirSync(logDir, {
                        recursive: true
                    });
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
        } catch (error) {
            console.error('Failed to write log to file:', error);
        }
    }
    // 检查并轮换日志文件
    checkAndRotateLogs(filePath) {
        try {
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
        } catch (error) {
            console.error('Failed to rotate logs:', error);
        }
    }
    // 清理旧备份文件
    cleanupOldBackups(directory, baseFileName) {
        try {
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
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/error-handler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$security$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/security-logger.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function Home() {
    // 状态管理
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 从API获取文章数据
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchPosts = async ()=>{
            setIsLoading(true);
            try {
                // 从API获取文章数据
                const response = await fetch('/api/posts');
                if (!response.ok) {
                    throw response;
                }
                let postsData = await response.json();
                // 为没有点赞数的文章添加默认点赞数
                postsData = postsData.map((post)=>({
                        ...post,
                        likes: post.likes || 0
                    }));
                // 为没有状态的文章添加默认状态为已发布
                postsData = postsData.map((post)=>({
                        ...post,
                        status: post.status || 'published'
                    }));
                // 只显示已发布的文章
                postsData = postsData.filter((post)=>post.status === 'published');
                // 按点赞量降序排序
                postsData.sort((a, b)=>b.likes - a.likes);
                setPosts(postsData);
                setError(null);
            } catch (error) {
                // 处理错误
                const errorResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$error$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createErrorResponse"])(error);
                setError(errorResponse.error.message);
                // 记录日志
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$security$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["securityLogger"].logApiCall('首页文章获取失败', {
                    ipAddress: 'client-side',
                    action: 'FETCH_POSTS',
                    resource: '/api/posts',
                    status: 'FAILURE',
                    details: {
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                });
            } finally{
                setIsLoading(false);
            }
        };
        // 初始化获取数据
        fetchPosts();
        // 每天12点更新数据
        const now = new Date();
        const nextNoon = new Date(now);
        nextNoon.setHours(12, 0, 0, 0);
        if (now > nextNoon) {
            nextNoon.setDate(nextNoon.getDate() + 1);
        }
        const timeUntilNoon = nextNoon.getTime() - now.getTime();
        const updateInterval = setTimeout(()=>{
            fetchPosts();
            // 之后每天更新一次
            setInterval(fetchPosts, 24 * 60 * 60 * 1000);
        }, timeUntilNoon);
        // 清理函数
        return ()=>{
            clearTimeout(updateInterval);
        };
    }, []);
    // 加载状态
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center py-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 115,
            columnNumber: 7
        }, this);
    }
    // 错误状态
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow-sm p-8 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-8 h-8 text-red-600",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-gray-800 mb-2",
                    children: "加载失败"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 mb-6",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>window.location.reload(),
                    className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors",
                    children: "重试"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 124,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl md:text-5xl font-bold text-gray-900 mb-4",
                        children: "我的技术博客"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg text-gray-600 max-w-2xl mx-auto",
                        children: "分享技术见解、生活感悟和学习心得，记录成长的每一步"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-bold text-gray-900",
                        children: "热门文章"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/all-posts",
                        className: "text-blue-600 font-medium hover:text-blue-800 transition-colors",
                        children: "查看全部文章"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                children: posts.slice(0, 3).map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
                        children: [
                            post.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-48 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: post.image,
                                        alt: post.title,
                                        className: "w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-3 left-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full",
                                            children: post.category?.name || '未分类'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 179,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 172,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center text-sm text-gray-500 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-4 h-4 mr-1",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            fillRule: "evenodd",
                                                            d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z",
                                                            clipRule: "evenodd"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 191,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 190,
                                                        columnNumber: 19
                                                    }, this),
                                                    new Date(post.createdAt).toLocaleDateString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 189,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mx-2",
                                                children: "•"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-4 h-4 mr-1",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            fillRule: "evenodd",
                                                            d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z",
                                                            clipRule: "evenodd"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 19
                                                    }, this),
                                                    post.author?.name || '未知作者'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-gray-900 mb-3 line-clamp-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/posts/${post.id}`,
                                            className: "hover:text-blue-600 transition-colors",
                                            children: post.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 205,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mb-4 line-clamp-3",
                                        children: post.excerpt
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/posts/${post.id}`,
                                                className: "inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors group",
                                                children: [
                                                    "阅读更多",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M14 5l7 7m0 0l-7 7m7-7H3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 213,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center text-gray-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-4 h-4 mr-1",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: post.likes
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, this)
                        ]
                    }, post.id, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/all-posts",
                    className: "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors",
                    children: [
                        "查看全部文章",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "ml-2 h-5 w-5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M14 5l7 7m0 0l-7 7m7-7H3"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 236,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0278e2f4._.js.map