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
"[project]/src/utils/违禁词检测.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 违禁词列表
__turbopack_context__.s([
    "countHiddenCharacters",
    ()=>countHiddenCharacters,
    "detectSensitiveWords",
    ()=>detectSensitiveWords,
    "filterSensitiveWords",
    ()=>filterSensitiveWords,
    "hasSensitiveWords",
    ()=>hasSensitiveWords
]);
const sensitiveWords = [
    '骚',
    '贱',
    '傻逼',
    '操',
    'fuck',
    'shit',
    '政治敏感词1',
    '政治敏感词2',
    '色情敏感词1',
    '色情敏感词2'
];
const detectSensitiveWords = (text)=>{
    const foundWords = [];
    sensitiveWords.forEach((word)=>{
        const regex = new RegExp(word, 'gi');
        if (regex.test(text)) {
            foundWords.push(word);
        }
    });
    return foundWords;
};
const hasSensitiveWords = (text)=>{
    return detectSensitiveWords(text).length > 0;
};
const filterSensitiveWords = (text)=>{
    let filteredText = text;
    sensitiveWords.forEach((word)=>{
        const regex = new RegExp(word, 'gi');
        filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    });
    return filteredText;
};
const countHiddenCharacters = (text)=>{
    // 匹配各种隐藏字符的正则表达式
    // 包括：零宽度空格、零宽度非连接符、零宽度连接符、制表符、换行符、回车符、垂直制表符、换页符等
    const hiddenCharRegex = /[\u200B-\u200D\uFEFF\t\n\r\v\f\u0000-\u001F\u007F-\u009F]/g;
    const matches = text.match(hiddenCharRegex);
    return matches ? matches.length : 0;
};
}),
"[project]/src/app/api/posts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f_8fdd$$_7981$$_8bcd$$_68c0$$_6d4b$$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/违禁词检测.ts [app-route] (ecmascript)");
;
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
async function GET() {
    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(`SELECT 
        p.id, p.title, p.excerpt, p.content, p.image, p.readTime, 
        p.authorId, p.categoryId, p.createdAt, p.updatedAt, p.status,
        p.foundSensitiveWords, p.reviewedBy, p.reviewedAt, p.rejectionReason,
        u.name as authorName, u.avatar as authorAvatar,
        c.name as categoryName, c.slug as categorySlug
      FROM post p
      LEFT JOIN user u ON p.authorId = u.id
      LEFT JOIN category c ON p.categoryId = c.id
      ORDER BY p.createdAt DESC`);
        await connection.end();
        // 转换数据格式
        const posts = rows.map((post)=>({
                id: post.id,
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image,
                readTime: post.readTime,
                authorId: post.authorId,
                categoryId: post.categoryId,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                status: post.status,
                foundSensitiveWords: post.foundSensitiveWords ? JSON.parse(post.foundSensitiveWords) : [],
                reviewedBy: post.reviewedBy,
                reviewedAt: post.reviewedAt,
                rejectionReason: post.rejectionReason,
                likes: 0,
                author: {
                    id: post.authorId,
                    name: post.authorName,
                    avatar: post.authorAvatar
                },
                category: {
                    id: post.categoryId,
                    name: post.categoryName,
                    slug: post.categorySlug
                },
                comments: []
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(posts, {
            status: 200
        });
    } catch (error) {
        console.error('获取文章数据失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '获取文章数据失败'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { title, excerpt, content, categoryId, image, authorId, readTime } = body;
        // 检测违禁词
        const allText = `${title} ${excerpt} ${content}`;
        const foundWords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f_8fdd$$_7981$$_8bcd$$_68c0$$_6d4b$$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectSensitiveWords"])(allText);
        const hasSensitive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f_8fdd$$_7981$$_8bcd$$_68c0$$_6d4b$$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasSensitiveWords"])(allText);
        // 根据敏感词检测结果设置文章状态
        const status = hasSensitive ? 'pending' : 'published';
        const connection = await createConnection();
        const now = new Date();
        const [result] = await connection.execute(`INSERT INTO post (title, excerpt, content, categoryId, image, authorId, readTime, status, foundSensitiveWords, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            title,
            excerpt,
            content,
            categoryId,
            image || null,
            authorId,
            readTime || null,
            status,
            JSON.stringify(foundWords),
            now,
            now
        ]);
        // 获取新创建的文章
        const [newPostRows] = await connection.execute(`SELECT 
        p.id, p.title, p.excerpt, p.content, p.image, p.readTime, 
        p.authorId, p.categoryId, p.status, p.foundSensitiveWords, p.createdAt, p.updatedAt,
        u.name as authorName, u.avatar as authorAvatar,
        c.name as categoryName, c.slug as categorySlug
      FROM post p
      LEFT JOIN user u ON p.authorId = u.id
      LEFT JOIN category c ON p.categoryId = c.id
      WHERE p.id = ?`, [
            result.insertId
        ]);
        await connection.end();
        const newPost = newPostRows[0];
        // 转换数据格式
        const formattedPost = {
            id: newPost.id,
            title: newPost.title,
            excerpt: newPost.excerpt,
            content: newPost.content,
            image: newPost.image,
            readTime: newPost.readTime,
            authorId: newPost.authorId,
            categoryId: newPost.categoryId,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt,
            status: newPost.status,
            foundSensitiveWords: newPost.foundSensitiveWords ? JSON.parse(newPost.foundSensitiveWords) : [],
            reviewedBy: null,
            reviewedAt: null,
            rejectionReason: null,
            author: {
                id: newPost.authorId,
                name: newPost.authorName,
                avatar: newPost.authorAvatar
            },
            category: {
                id: newPost.categoryId,
                name: newPost.categoryName,
                slug: newPost.categorySlug
            },
            comments: []
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(formattedPost, {
            status: 201
        });
    } catch (error) {
        console.error('创建文章失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '创建文章失败'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { id, status, reviewedBy, rejectionReason } = body;
        if (!id || !status || !reviewedBy) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '缺少必要参数'
            }, {
                status: 400
            });
        }
        const connection = await createConnection();
        const now = new Date();
        // 根据状态更新文章
        let query = '';
        let params = [];
        if (status === 'published') {
            // 审核通过
            query = `UPDATE post SET status = ?, reviewedBy = ?, reviewedAt = ?, rejectionReason = NULL, updatedAt = ? WHERE id = ?`;
            params = [
                status,
                reviewedBy,
                now,
                now,
                id
            ];
        } else if (status === 'rejected') {
            // 审核不通过
            if (!rejectionReason) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: '拒绝原因不能为空'
                }, {
                    status: 400
                });
            }
            query = `UPDATE post SET status = ?, reviewedBy = ?, reviewedAt = ?, rejectionReason = ?, updatedAt = ? WHERE id = ?`;
            params = [
                status,
                reviewedBy,
                now,
                rejectionReason,
                now,
                id
            ];
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '无效的状态'
            }, {
                status: 400
            });
        }
        const [result] = await connection.execute(query, params);
        if (result.affectedRows === 0) {
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '文章不存在'
            }, {
                status: 404
            });
        }
        // 获取更新后的文章
        const [updatedPostRows] = await connection.execute(`SELECT 
        p.id, p.title, p.excerpt, p.content, p.image, p.readTime, 
        p.authorId, p.categoryId, p.status, p.foundSensitiveWords, p.reviewedBy, p.reviewedAt, p.rejectionReason, p.createdAt, p.updatedAt,
        u.name as authorName, u.avatar as authorAvatar,
        c.name as categoryName, c.slug as categorySlug
      FROM post p
      LEFT JOIN user u ON p.authorId = u.id
      LEFT JOIN category c ON p.categoryId = c.id
      WHERE p.id = ?`, [
            id
        ]);
        await connection.end();
        const updatedPost = updatedPostRows[0];
        // 转换数据格式
        const formattedPost = {
            id: updatedPost.id,
            title: updatedPost.title,
            excerpt: updatedPost.excerpt,
            content: updatedPost.content,
            image: updatedPost.image,
            readTime: updatedPost.readTime,
            authorId: updatedPost.authorId,
            categoryId: updatedPost.categoryId,
            createdAt: updatedPost.createdAt,
            updatedAt: updatedPost.updatedAt,
            status: updatedPost.status,
            foundSensitiveWords: updatedPost.foundSensitiveWords ? JSON.parse(updatedPost.foundSensitiveWords) : [],
            reviewedBy: updatedPost.reviewedBy,
            reviewedAt: updatedPost.reviewedAt,
            rejectionReason: updatedPost.rejectionReason,
            likes: 0,
            author: {
                id: updatedPost.authorId,
                name: updatedPost.authorName,
                avatar: updatedPost.authorAvatar
            },
            category: {
                id: updatedPost.categoryId,
                name: updatedPost.categoryName,
                slug: updatedPost.categorySlug
            },
            comments: []
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(formattedPost, {
            status: 200
        });
    } catch (error) {
        console.error('更新文章状态失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '更新文章状态失败'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = parseInt(searchParams.get('id') || '0');
        if (!postId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid post ID'
            }, {
                status: 400
            });
        }
        const connection = await createConnection();
        const [result] = await connection.execute('DELETE FROM post WHERE id = ?', [
            postId
        ]);
        await connection.end();
        if (result.affectedRows === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Post not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Post deleted successfully'
        }, {
            status: 200
        });
    } catch (error) {
        console.error('删除文章失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '删除文章失败'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__004b6f00._.js.map