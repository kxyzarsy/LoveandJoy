(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware-edge] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'jsonwebtoken'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
function middleware(request) {
    // 不需要验证的路由
    const publicPaths = [
        '/api/auth/login',
        '/api/auth/send-verification-code',
        '/api/posts',
        '/api/footer-config'
    ];
    const isPublicPath = publicPaths.some((path)=>request.nextUrl.pathname.startsWith(path) || request.nextUrl.pathname === path);
    // 公开路由直接放行
    if (isPublicPath) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // 从请求头获取Authorization令牌
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    // 没有令牌，返回401错误
    if (!token) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: '未授权访问',
            message: '请先登录'
        }, {
            status: 401
        });
    }
    try {
        // 验证JWT令牌
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secretKey);
        // 检查是否需要管理员权限
        const adminOnlyPaths = [
            '/api/admin',
            '/api/dashboard-stats',
            '/api/users',
            '/api/comments'
        ];
        const requiresAdmin = adminOnlyPaths.some((path)=>request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`));
        console.log('Request path:', request.nextUrl.pathname);
        console.log('Requires admin:', requiresAdmin);
        // 如果需要管理员权限，但用户不是管理员，返回403错误
        if (requiresAdmin && decoded.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: '权限不足',
                message: '需要管理员权限才能访问此资源'
            }, {
                status: 403
            });
        }
        // 将用户信息添加到请求头中，供后续API路由使用
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('X-User-Id', decoded.userId.toString());
        requestHeaders.set('X-User-Email', decoded.email);
        requestHeaders.set('X-User-Role', decoded.role);
        // 允许请求继续
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
            headers: requestHeaders
        });
    } catch (error) {
        console.error('JWT验证失败:', error);
        // 令牌无效或过期，返回401错误
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: '无效的令牌',
            message: '登录已过期，请重新登录'
        }, {
            status: 401
        });
    }
}
const config = {
    matcher: '/api/:path*'
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map