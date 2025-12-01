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
"[project]/src/utils/违禁词检测.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 违禁词列表
__turbopack_context__.s([
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
}),
"[project]/src/app/api/posts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f_8fdd$$_7981$$_8bcd$$_68c0$$_6d4b$$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/违禁词检测.ts [app-route] (ecmascript)");
;
;
// 使用全局变量存储文章数据（实际项目中应使用数据库）
let posts = [
    {
        id: 1,
        title: '欢迎来到我的博客',
        excerpt: '这是我的第一篇博客文章，我将在这里分享我的生活和思考。',
        content: '<p>这是我的第一篇博客文章，我将在这里分享我的生活和思考。</p><p>博客是一个很好的平台，可以记录自己的成长历程，分享自己的经验和见解，与他人交流和学习。</p>',
        categoryId: 1,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        status: 'published',
        foundSensitiveWords: [],
        createdAt: new Date().toISOString(),
        authorId: 1,
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
        likes: 0,
        author: {
            id: 1,
            name: '博主',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        category: {
            id: 1,
            name: '生活',
            slug: 'life'
        },
        comments: []
    }
];
async function GET() {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch posts'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const postData = await request.json();
        // 检测违禁词
        const allText = `${postData.title} ${postData.excerpt} ${postData.content}`;
        const foundWords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f_8fdd$$_7981$$_8bcd$$_68c0$$_6d4b$$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectSensitiveWords"])(allText);
        const hasSensitive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f_8fdd$$_7981$$_8bcd$$_68c0$$_6d4b$$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasSensitiveWords"])(allText);
        // 生成新文章，确保含有违禁词的文章状态为pending
        const newPost = {
            id: posts.length + 1,
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            categoryId: postData.categoryId,
            image: postData.image,
            status: hasSensitive ? 'pending' : postData.status,
            foundSensitiveWords: foundWords,
            createdAt: postData.createdAt || new Date().toISOString(),
            authorId: postData.authorId,
            reviewedBy: postData.reviewedBy || null,
            reviewedAt: postData.reviewedAt || null,
            rejectionReason: postData.rejectionReason || null,
            likes: postData.likes || 0,
            // 系统生成字段
            author: {
                id: postData.authorId,
                name: '博主',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
            },
            category: {
                id: postData.categoryId,
                name: '技术',
                slug: 'tech'
            },
            comments: []
        };
        // 保存文章到全局变量（实际项目中应保存到数据库）
        posts.push(newPost);
        console.log('发布文章:', newPost);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newPost, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create post'
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
        // 查找文章索引
        const postIndex = posts.findIndex((post)=>post.id === postId);
        if (postIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Post not found'
            }, {
                status: 404
            });
        }
        // 从全局变量中删除文章（实际项目中应从数据库删除）
        posts.splice(postIndex, 1);
        console.log('删除文章:', postId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Post deleted successfully'
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete post'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d34eab34._.js.map