module.exports = [
"[project]/src/app/admin-secret.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 管理员秘钥管理系统
 * 用于管理管理员登录秘钥，实现高安全性的管理员认证
 */ /**
 * 管理员秘钥管理系统
 * 用于管理管理员登录秘钥，实现高安全性的管理员认证
 * 注意：当前使用临时解决方案，后续将替换为数据库实现
 */ /**
 * 生成随机秘钥
 * @param length 秘钥长度
 * @returns 随机秘钥
 */ __turbopack_context__.s([
    "checkSecretUpdateNeeded",
    ()=>checkSecretUpdateNeeded,
    "generateSecretKey",
    ()=>generateSecretKey,
    "getCurrentSecret",
    ()=>getCurrentSecret,
    "initializeAdminSecret",
    ()=>initializeAdminSecret,
    "logLoginAttempt",
    ()=>logLoginAttempt,
    "sendSecretUpdateEmail",
    ()=>sendSecretUpdateEmail,
    "updateAdminSecret",
    ()=>updateAdminSecret,
    "validateSecret",
    ()=>validateSecret
]);
function generateSecretKey(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for(let i = 0; i < length; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
async function getCurrentSecret() {
    try {
        // 这里使用内存存储作为临时解决方案，后续将替换为数据库查询
        const secret = process.env.ADMIN_SECRET || 'default-secret-key';
        return secret;
    } catch (error) {
        console.error('获取当前秘钥失败:', error);
        return null;
    }
}
async function validateSecret(secretKey) {
    try {
        const currentSecret = await getCurrentSecret();
        return secretKey === currentSecret;
    } catch (error) {
        console.error('验证秘钥失败:', error);
        return false;
    }
}
async function updateAdminSecret(updatedBy) {
    try {
        const newSecret = generateSecretKey();
        // 这里使用环境变量作为临时解决方案，后续将替换为数据库更新
        // 发送秘钥更新通知邮件
        await sendSecretUpdateEmail(newSecret);
        return newSecret;
    } catch (error) {
        console.error('更新管理员秘钥失败:', error);
        throw error;
    }
}
async function sendSecretUpdateEmail(newSecret) {
    try {
        const emailData = {
            to: 'kxyatxy116@163.com',
            subject: '【重要】管理员秘钥已更新',
            html: `
        <h2>管理员秘钥更新通知</h2>
        <p>您的管理员秘钥已成功更新，新秘钥如下：</p>
        <p style="font-size: 18px; font-weight: bold; color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${newSecret}</p>
        <p>请妥善保管此秘钥，切勿泄露给他人。</p>
        <p>秘钥有效期：7天</p>
        <p>系统将在秘钥过期前24小时再次提醒您更新。</p>
        <hr>
        <p>此邮件由系统自动发送，请勿回复。</p>
      `
        };
        // 调用服务器端API发送邮件
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        if (response.ok) {} else {
            console.error('发送秘钥更新邮件失败:', await response.json());
        }
    } catch (error) {
        console.error('发送秘钥更新邮件失败:', error);
    }
}
async function logLoginAttempt(data) {
    try {
    // 这里使用控制台日志作为临时解决方案，后续将替换为数据库插入
    } catch (error) {
        console.error('记录登录日志失败:', error);
    }
}
async function checkSecretUpdateNeeded() {
    try {
        // 这里使用固定逻辑作为临时解决方案，后续将替换为数据库查询
        // 实际实现中应检查秘钥创建时间，判断是否需要更新
        return false;
    } catch (error) {
        console.error('检查秘钥更新需求失败:', error);
        return false;
    }
}
async function initializeAdminSecret() {
    try {
        // 检查是否已有秘钥
        const currentSecret = await getCurrentSecret();
        if (!currentSecret || currentSecret === 'default-secret-key') {
            // 生成新秘钥
            const newSecret = generateSecretKey();
            await sendSecretUpdateEmail(newSecret);
        }
    } catch (error) {
        console.error('初始化管理员秘钥失败:', error);
    }
}
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/utils/admin-state-manager.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 管理员页面专用状态管理工具
// 使用正确的jsonwebtoken导入方式
__turbopack_context__.s([
    "adminAuth",
    ()=>adminAuth,
    "clearAllAdminState",
    ()=>clearAllAdminState,
    "generateAdminToken",
    ()=>generateAdminToken,
    "getAdminHeaders",
    ()=>getAdminHeaders,
    "getAdminState",
    ()=>getAdminState,
    "listenToAdminStateChanges",
    ()=>listenToAdminStateChanges,
    "removeAdminState",
    ()=>removeAdminState,
    "setAdminState",
    ()=>setAdminState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-ssr] (ecmascript)");
;
// 键名前缀，避免与用户页面状态冲突
const ADMIN_STATE_PREFIX = 'admin_';
const generateAdminToken = (userId, email, role)=>{
    // 使用环境变量或安全的密钥
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const expiresIn = '2h'; // 令牌过期时间
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].sign({
        userId,
        email,
        role
    }, secretKey, {
        expiresIn
    });
};
const getAdminState = (key)=>{
    try {
        const fullKey = `${ADMIN_STATE_PREFIX}${key}`;
        const value = localStorage.getItem(fullKey);
        if (!value) return null;
        // 尝试解析为 JSON，如果失败则直接返回字符串
        try {
            return JSON.parse(value);
        } catch (parseError) {
            // 如果解析失败，直接返回字符串值，不进行类型转换
            return value;
        }
    } catch (error) {
        console.error('获取管理员状态失败:', error);
        return null;
    }
};
const setAdminState = (key, value)=>{
    try {
        const fullKey = `${ADMIN_STATE_PREFIX}${key}`;
        localStorage.setItem(fullKey, JSON.stringify(value));
        // 触发自定义事件，通知其他组件状态已更新
        window.dispatchEvent(new Event('adminStateChanged'));
    } catch (error) {
        console.error('设置管理员状态失败:', error);
    }
};
const removeAdminState = (key)=>{
    try {
        const fullKey = `${ADMIN_STATE_PREFIX}${key}`;
        localStorage.removeItem(fullKey);
        // 触发自定义事件，通知其他组件状态已更新
        window.dispatchEvent(new Event('adminStateChanged'));
    } catch (error) {
        console.error('删除管理员状态失败:', error);
    }
};
const clearAllAdminState = ()=>{
    try {
        // 遍历所有localStorage项，删除带有管理员前缀的项
        for(let i = 0; i < localStorage.length; i++){
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
const listenToAdminStateChanges = (callback)=>{
    window.addEventListener('adminStateChanged', callback);
    return ()=>{
        window.removeEventListener('adminStateChanged', callback);
    };
};
const getAdminHeaders = ()=>{
    let token = getAdminState('token');
    // 如果令牌是带引号的字符串，去除引号
    if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }
    return {
        'Content-Type': 'application/json',
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {}
    };
};
const adminAuth = {
    // 检查管理员是否已登录
    isAuthenticated: ()=>{
        return getAdminState('isLoggedIn') === true;
    },
    // 获取当前登录的管理员用户
    getCurrentUser: ()=>{
        return getAdminState('user');
    },
    // 管理员登录
    login: (user)=>{
        // 生成JWT令牌
        const token = generateAdminToken(user.id, user.email, user.role);
        console.log('Generated admin token:', token);
        setAdminState('isLoggedIn', true);
        setAdminState('user', user);
        setAdminState('token', token);
        // 验证令牌是否正确存储
        const storedToken = getAdminState('token');
        console.log('Stored admin token:', storedToken);
    },
    // 管理员登出
    logout: ()=>{
        clearAllAdminState();
    }
};
}),
"[project]/src/app/admin/secret-login/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SecretAdminLoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin-secret.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$admin$2d$state$2d$manager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/admin-state-manager.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function SecretAdminLoginPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [secretKey, setSecretKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSecretField, setShowSecretField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 隐藏式入口验证：只有输入正确的初始密码才能显示秘钥字段
    const handleInitialSubmit = (e)=>{
        e.preventDefault();
        const initialPassword = e.currentTarget.initialPassword.value;
        // 初始密码验证（简单的隐藏入口机制）
        if (initialPassword === 'admin-portal') {
            setShowSecretField(true);
        } else {
            // 记录失败尝试
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logLoginAttempt"])({
                username: 'unknown',
                ipAddress: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                isSuccess: false,
                errorMessage: '初始密码错误'
            });
            setErrors({
                message: '访问被拒绝'
            });
        }
    };
    const handleLogin = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        try {
            // 记录登录尝试
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logLoginAttempt"])({
                username,
                ipAddress: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                isSuccess: false
            });
            // 验证管理员秘钥
            const isSecretValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateSecret"])(secretKey);
            if (!isSecretValid) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logLoginAttempt"])({
                    username,
                    ipAddress: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                    userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                    isSuccess: false,
                    errorMessage: '管理员秘钥错误'
                });
                setErrors({
                    message: '管理员秘钥错误'
                });
                return;
            }
            // 通过API进行登录验证
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: username === 'admin' ? 'admin@admin' : username,
                    password
                })
            });
            const loginData = await loginResponse.json();
            if (!loginResponse.ok || !loginData.success) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logLoginAttempt"])({
                    username,
                    ipAddress: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                    userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                    isSuccess: false,
                    errorMessage: loginData.message || '用户名或密码错误'
                });
                setErrors({
                    message: loginData.message || '用户名或密码错误'
                });
                return;
            }
            // 登录成功，记录登录日志
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logLoginAttempt"])({
                username,
                ipAddress: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                isSuccess: true
            });
            // 设置管理员用户数据
            const userData = {
                id: loginData.data.userInfo.id,
                name: loginData.data.userInfo.name,
                username: loginData.data.userInfo.usernameId,
                email: loginData.data.userInfo.email,
                avatar: loginData.data.userInfo.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                bio: '系统管理员',
                role: loginData.data.userInfo.role,
                createdAt: new Date().toISOString()
            };
            // 使用管理员专用状态管理工具保存登录状态
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$admin$2d$state$2d$manager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminAuth"].login(userData);
            // 跳转到管理员后台首页
            router.push('/admin');
        } catch (error) {
            console.error('登录失败:', error);
            setErrors({
                message: '登录失败，请重试'
            });
            // 记录失败日志
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logLoginAttempt"])({
                username,
                ipAddress: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                isSuccess: false,
                errorMessage: '系统错误'
            });
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                            children: showSecretField ? '管理员登录' : '访问验证'
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-center text-sm text-gray-600",
                            children: showSecretField ? '请输入管理员账号、密码和秘钥' : '请输入访问密码'
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, this),
                errors.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md",
                    children: errors.message
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 151,
                    columnNumber: 11
                }, this),
                !showSecretField ? // 初始访问验证表单
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "mt-8 space-y-6",
                    onSubmit: handleInitialSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "initialPassword",
                                    className: "sr-only",
                                    children: "访问密码"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "initialPassword",
                                    name: "initialPassword",
                                    type: "password",
                                    required: true,
                                    className: "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                                    placeholder: "请输入访问密码"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                                children: "验证访问"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 158,
                    columnNumber: 11
                }, this) : // 完整管理员登录表单
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: "mt-8 space-y-6",
                    onSubmit: handleLogin,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-md -space-y-px",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "username",
                                            className: "sr-only",
                                            children: "用户名"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                            lineNumber: 187,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "username",
                                            name: "username",
                                            type: "text",
                                            autoComplete: "username",
                                            required: true,
                                            className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                                            placeholder: "用户名",
                                            value: username,
                                            onChange: (e)=>setUsername(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                            lineNumber: 190,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "password",
                                            className: "sr-only",
                                            children: "密码"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "password",
                                            name: "password",
                                            type: "password",
                                            autoComplete: "current-password",
                                            required: true,
                                            className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                                            placeholder: "密码",
                                            value: password,
                                            onChange: (e)=>setPassword(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                            lineNumber: 206,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "secretKey",
                                            className: "sr-only",
                                            children: "管理员秘钥"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                            lineNumber: 219,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "secretKey",
                                            name: "secretKey",
                                            type: "password",
                                            required: true,
                                            className: "appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                                            placeholder: "管理员秘钥",
                                            value: secretKey,
                                            onChange: (e)=>setSecretKey(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 185,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isLoading,
                                className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
                                children: isLoading ? '登录中...' : '登录'
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                lineNumber: 236,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 235,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 184,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/secret-login/page.tsx",
            lineNumber: 140,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/secret-login/page.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__681f2d86._.js.map