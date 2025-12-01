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
"[project]/src/app/api/users/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
;
// 创建数据库连接
async function createConnection() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'yueblog'
    });
}
async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        // 检查请求路径，确认是获取用户信息还是博文数量
        const url = new URL(request.url);
        const pathname = url.pathname;
        const connection = await createConnection();
        // 如果是获取博文数量
        if (pathname.endsWith('/posts/count')) {
            const [postRows] = await connection.execute('SELECT COUNT(*) as count FROM post WHERE authorId = ?', [
                id
            ]);
            await connection.end();
            const postCount = postRows[0].count;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                count: postCount
            }, {
                status: 200
            });
        }
        // 否则，获取单个用户信息
        const [rows] = await connection.execute('SELECT id, name, email, usernameId, avatar, backgroundImage, bio, createdAt, updatedAt, lastUsernameChange FROM user WHERE id = ?', [
            id
        ]);
        await connection.end();
        const user = rows[0];
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '用户不存在'
            }, {
                status: 404
            });
        }
        // 计算剩余时间（如果有lastUsernameChange）
        let remainingHours = 0;
        if (user.lastUsernameChange) {
            const lastChangeTime = new Date(user.lastUsernameChange);
            const now = new Date();
            const diffHours = (now.getTime() - lastChangeTime.getTime()) / (1000 * 60 * 60);
            remainingHours = Math.max(0, Math.ceil(720 - diffHours));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...user,
            remainingUsernameChangeHours: remainingHours
        }, {
            status: 200
        });
    } catch (error) {
        console.error('获取用户数据失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '获取用户数据失败'
        }, {
            status: 500
        });
    }
}
async function PUT(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const body = await request.json();
        const { name, email, password, avatar, bio, role, lastLoginAt, usernameId, backgroundImage } = body;
        // 管理员后台用户管理不需要权限限制，允许修改所有用户资料
        // 移除权限控制，因为管理员应该有权限修改所有用户
        const connection = await createConnection();
        // 开始事务
        await connection.beginTransaction();
        // 构建更新语句和参数
        const updateFields = [];
        const updateParams = [];
        // 只更新数据库中存在的字段
        if (name !== undefined) {
            updateFields.push('name = ?');
            updateParams.push(name || null);
        }
        if (email !== undefined) {
            updateFields.push('email = ?');
            updateParams.push(email || null);
        }
        if (password !== undefined) {
            updateFields.push('password = ?');
            updateParams.push(password || null);
        }
        if (usernameId !== undefined) {
            updateFields.push('usernameId = ?');
            updateParams.push(usernameId || null);
            // 如果用户名ID被修改，更新lastUsernameChange字段
            updateFields.push('lastUsernameChange = NOW()');
        }
        if (avatar !== undefined) {
            let avatarValue = avatar || null;
            // 限制avatar字段长度，防止超过数据库字段限制
            if (avatarValue && typeof avatarValue === 'string') {
                // 如果是Data URL且长度超过1MB，使用默认头像
                if (avatarValue.startsWith('data:') && avatarValue.length > 1 * 1024 * 1024) {
                    avatarValue = 'https://via.placeholder.com/100';
                } else if (avatarValue.length > 100000) {
                    // 限制字符串长度不超过100KB
                    avatarValue = avatarValue.substring(0, 100000);
                }
            }
            updateFields.push('avatar = ?');
            updateParams.push(avatarValue);
        }
        if (backgroundImage !== undefined) {
            let backgroundImageValue = backgroundImage || null;
            // 限制backgroundImage字段长度，防止超过数据库字段限制
            if (backgroundImageValue && typeof backgroundImageValue === 'string') {
                // 如果是Data URL且长度超过1MB，使用默认值
                if (backgroundImageValue.startsWith('data:') && backgroundImageValue.length > 1 * 1024 * 1024) {
                    backgroundImageValue = null;
                } else if (backgroundImageValue.length > 100000) {
                    // 限制字符串长度不超过100KB
                    backgroundImageValue = backgroundImageValue.substring(0, 100000);
                }
            }
            updateFields.push('backgroundImage = ?');
            updateParams.push(backgroundImageValue);
        }
        if (bio !== undefined) {
            updateFields.push('bio = ?');
            updateParams.push(bio || null);
        }
        if (role !== undefined) {
            updateFields.push('role = ?');
            updateParams.push(role || null);
        }
        updateFields.push('updatedAt = NOW()');
        updateParams.push(id);
        // 只有当有字段需要更新时才执行更新
        if (updateFields.length > 1) {
            // 如果用户名ID被修改，检查唯一性
            if (usernameId !== undefined) {
                const [existingUserRows] = await connection.execute('SELECT id FROM user WHERE usernameId = ? AND id != ?', [
                    usernameId,
                    id
                ]);
                if (existingUserRows.length > 0) {
                    await connection.rollback();
                    await connection.end();
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: '用户名ID已存在',
                        message: '该用户名ID已被其他用户使用，请选择其他ID'
                    }, {
                        status: 400
                    });
                }
            }
            const [result] = await connection.execute(`UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`, updateParams);
            // 检查是否有行被更新
            if (result.affectedRows === 0) {
                await connection.rollback();
                await connection.end();
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: '用户不存在'
                }, {
                    status: 404
                });
            }
        }
        // 获取更新后的用户信息
        const [updatedUserRows] = await connection.execute('SELECT id, name, email, usernameId, avatar, backgroundImage, bio, createdAt, updatedAt, lastUsernameChange FROM user WHERE id = ?', [
            id
        ]);
        // 提交事务
        await connection.commit();
        await connection.end();
        const updatedUser = updatedUserRows[0];
        // 计算剩余时间（如果有lastUsernameChange）
        let remainingHours = 0;
        if (updatedUser.lastUsernameChange) {
            const lastChangeTime = new Date(updatedUser.lastUsernameChange);
            const now = new Date();
            const diffHours = (now.getTime() - lastChangeTime.getTime()) / (1000 * 60 * 60);
            remainingHours = Math.max(0, Math.ceil(720 - diffHours));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...updatedUser,
            remainingUsernameChangeHours: remainingHours
        }, {
            status: 200
        });
    } catch (error) {
        console.error('更新用户数据失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '更新用户数据失败',
            details: error.message
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        // 获取请求体，检查是否需要删除关联的博文
        const body = await request.json().catch(()=>({}));
        const deletePosts = body.deletePosts || false;
        const connection = await createConnection();
        // 开始事务
        await connection.beginTransaction();
        try {
            // 先获取要删除的用户信息
            const [userRows] = await connection.execute('SELECT id, name, email, usernameId, avatar, bio, createdAt, updatedAt FROM user WHERE id = ?', [
                id
            ]);
            const user = userRows[0];
            if (!user) {
                await connection.rollback();
                await connection.end();
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: '用户不存在'
                }, {
                    status: 404
                });
            }
            if (deletePosts) {
                // 删除关联的博文
                await connection.execute('DELETE FROM post WHERE authorId = ?', [
                    id
                ]);
            } else {
                // 检查是否有关联的帖子
                const [postRows] = await connection.execute('SELECT COUNT(*) as postCount FROM post WHERE authorId = ?', [
                    id
                ]);
                const postCount = postRows[0].postCount;
                if (postCount > 0) {
                    await connection.rollback();
                    await connection.end();
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: '删除用户失败',
                        message: `该用户还有${postCount}个关联的帖子，无法直接删除。请先删除这些帖子，或联系管理员处理。`
                    }, {
                        status: 400
                    });
                }
            }
            // 删除用户
            await connection.execute('DELETE FROM user WHERE id = ?', [
                id
            ]);
            // 提交事务
            await connection.commit();
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(user, {
                status: 200
            });
        } catch (error) {
            // 回滚事务
            await connection.rollback();
            await connection.end();
            // 处理外键约束错误
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: '删除用户失败',
                    message: '该用户还有关联的数据（如帖子），无法直接删除。请先删除这些关联数据，或联系管理员处理。'
                }, {
                    status: 400
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('删除用户失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '删除用户失败'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4f482936._.js.map