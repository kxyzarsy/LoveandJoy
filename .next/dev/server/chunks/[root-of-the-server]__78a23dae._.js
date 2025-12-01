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
"[project]/src/app/admin-secret.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        console.log('管理员秘钥已更新:', newSecret);
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
        if (response.ok) {
            console.log('秘钥更新邮件已发送');
        } else {
            console.error('发送秘钥更新邮件失败:', await response.json());
        }
    } catch (error) {
        console.error('发送秘钥更新邮件失败:', error);
    }
}
async function logLoginAttempt(data) {
    try {
        // 这里使用控制台日志作为临时解决方案，后续将替换为数据库插入
        console.log('登录日志:', data);
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
            console.log('初始化管理员秘钥:', newSecret);
            await sendSecretUpdateEmail(newSecret);
        }
    } catch (error) {
        console.error('初始化管理员秘钥失败:', error);
    }
}
}),
"[project]/src/app/api/admin/credentials/secret-key/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin-secret.ts [app-route] (ecmascript)");
;
;
// 模拟日志记录函数
const logOperation = (action, userId, ipAddress, success, details)=>{
    console.log(`[${new Date().toISOString()}] ${action} - User: ${userId}, IP: ${ipAddress}, Success: ${success}, Details: ${details}`);
};
async function PUT(request) {
    try {
        const body = await request.json();
        const { currentKey, newKey } = body;
        // 获取客户端IP地址
        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';
        // 验证当前密钥
        const isValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2d$secret$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSecret"])(currentKey);
        if (!isValid) {
            logOperation('Update Admin Secret', null, ipAddress, false, 'Invalid current secret key');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '当前密钥验证失败'
            }, {
                status: 401
            });
        }
        // 验证新密钥复杂度
        if (newKey.length < 16) {
            logOperation('Update Admin Secret', null, ipAddress, false, 'New secret too short');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '密钥长度至少为16个字符'
            }, {
                status: 400
            });
        }
        if (!/[A-Z]/.test(newKey)) {
            logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing uppercase letter');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '密钥必须包含至少一个大写字母'
            }, {
                status: 400
            });
        }
        if (!/[a-z]/.test(newKey)) {
            logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing lowercase letter');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '密钥必须包含至少一个小写字母'
            }, {
                status: 400
            });
        }
        if (!/[0-9]/.test(newKey)) {
            logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing number');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '密钥必须包含至少一个数字'
            }, {
                status: 400
            });
        }
        if (!/[^A-Za-z0-9]/.test(newKey)) {
            logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing special character');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '密钥必须包含至少一个特殊字符'
            }, {
                status: 400
            });
        }
        // 这里应该是更新数据库中的密钥，目前使用环境变量模拟
        console.log('管理员密钥已更新:', newKey);
        // 记录操作日志
        logOperation('Update Admin Secret', null, ipAddress, true, 'Secret key updated successfully');
        // 发送密钥更新通知邮件
        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: 'kxyatxy116@163.com',
                    subject: '【重要】管理员密钥已更新',
                    html: `
            <h2>管理员密钥更新通知</h2>
            <p>您的管理员密钥已成功更新，新密钥如下：</p>
            <p style="font-size: 18px; font-weight: bold; color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${newKey}</p>
            <p>请妥善保管此密钥，切勿泄露给他人。</p>
            <hr>
            <p>此邮件由系统自动发送，请勿回复。</p>
          `
                })
            });
        } catch (emailError) {
            console.error('发送密钥更新邮件失败:', emailError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: '管理员密钥更新成功'
        });
    } catch (error) {
        console.error('更新管理员密钥失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '更新失败，请稍后重试'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__78a23dae._.js.map