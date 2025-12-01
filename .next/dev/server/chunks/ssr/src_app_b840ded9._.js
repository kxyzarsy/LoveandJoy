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
            // 检查输入是否为邮箱格式
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
            // 根据输入类型构建请求体
            let loginBody = {};
            if (isEmail) {
                // 如果是邮箱，直接使用
                loginBody = {
                    email: username,
                    password
                };
            } else {
                // 如果不是邮箱，尝试通过用户名ID查询用户邮箱
                try {
                    const userResponse = await fetch(`/api/users?usernameId=${username}`);
                    const userData = await userResponse.json();
                    if (userData.length > 0) {
                        // 使用查询到的邮箱进行登录
                        loginBody = {
                            email: userData[0].email,
                            password
                        };
                    } else {
                        // 如果查询不到，返回错误
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logLoginAttempt"])({
                            username,
                            ipAddress: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                            userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'unknown',
                            isSuccess: false,
                            errorMessage: '用户名不存在'
                        });
                        setErrors({
                            message: '用户名不存在'
                        });
                        return;
                    }
                } catch (error) {
                    console.error('查询用户邮箱失败:', error);
                    setErrors({
                        message: '登录失败，请重试'
                    });
                    return;
                }
            }
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginBody)
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$admin$2d$state$2d$manager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminAuth"].login(userData, loginData.data.token);
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
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-center text-sm text-gray-600",
                            children: showSecretField ? '请输入管理员账号、密码和秘钥' : '请输入访问密码'
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this),
                errors.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md",
                    children: errors.message
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 190,
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
                                    lineNumber: 199,
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
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 198,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
                                children: "验证访问"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                lineNumber: 213,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 212,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 197,
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
                                            lineNumber: 226,
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
                                            lineNumber: 229,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 225,
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
                                            lineNumber: 242,
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
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 241,
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
                                            lineNumber: 258,
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
                                            lineNumber: 261,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 224,
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
                                lineNumber: 275,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/secret-login/page.tsx",
                            lineNumber: 274,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/secret-login/page.tsx",
                    lineNumber: 223,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/secret-login/page.tsx",
            lineNumber: 179,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/secret-login/page.tsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_app_b840ded9._.js.map