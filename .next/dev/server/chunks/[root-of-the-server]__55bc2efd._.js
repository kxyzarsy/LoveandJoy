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
"[project]/src/app/api/footer-config/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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
async function GET() {
    try {
        const connection = await createConnection();
        // 查询页脚配置
        const [rows] = await connection.execute('SELECT * FROM footer_config ORDER BY id DESC LIMIT 1');
        await connection.end();
        let config = rows[0];
        // 确保所有字符串字段不为null，转换为空字符串
        if (config) {
            config = {
                ...config,
                site_title: config.site_title || '',
                site_description: config.site_description || '',
                email: config.email || '',
                phone: config.phone || '',
                address: config.address || '',
                social_facebook: config.social_facebook || '',
                social_twitter: config.social_twitter || '',
                social_instagram: config.social_instagram || '',
                social_github: config.social_github || '',
                social_linkedin: config.social_linkedin || '',
                copyright_text: config.copyright_text || ''
            };
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(config, {
            status: 200
        });
    } catch (error) {
        console.error('获取页尾配置失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '获取页尾配置失败'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const connection = await createConnection();
        // 检查是否存在配置
        const [existingConfigs] = await connection.execute('SELECT id FROM footer_config ORDER BY id DESC LIMIT 1');
        if (existingConfigs.length > 0) {
            // 更新现有配置
            const configId = existingConfigs[0].id;
            await connection.execute(`UPDATE footer_config SET 
          site_title = ?, site_description = ?, email = ?, phone = ?, address = ?, 
          social_facebook = ?, social_twitter = ?, social_instagram = ?, social_github = ?, social_linkedin = ?, 
          quick_links = ?, 
          background_color = ?, text_color = ?, link_color = ?, link_hover_color = ?, border_color = ?, font_size = ?, 
          layout_columns = ?, show_social_media = ?, show_contact_info = ?, show_quick_links = ?, show_copyright = ?, 
          copyright_text = ? 
        WHERE id = ?`, [
                body.site_title,
                body.site_description,
                body.email,
                body.phone,
                body.address,
                body.social_facebook,
                body.social_twitter,
                body.social_instagram,
                body.social_github,
                body.social_linkedin,
                JSON.stringify(body.quick_links),
                body.background_color,
                body.text_color,
                body.link_color,
                body.link_hover_color,
                body.border_color,
                body.font_size,
                body.layout_columns,
                body.show_social_media,
                body.show_contact_info,
                body.show_quick_links,
                body.show_copyright,
                body.copyright_text,
                configId
            ]);
            // 获取更新后的配置
            const [updatedConfigs] = await connection.execute('SELECT * FROM footer_config WHERE id = ?', [
                configId
            ]);
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedConfigs[0], {
                status: 200
            });
        } else {
            // 创建新配置
            const [result] = await connection.execute(`INSERT INTO footer_config (
          site_title, site_description, email, phone, address, 
          social_facebook, social_twitter, social_instagram, social_github, social_linkedin, 
          quick_links, 
          background_color, text_color, link_color, link_hover_color, border_color, font_size, 
          layout_columns, show_social_media, show_contact_info, show_quick_links, show_copyright, 
          copyright_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                body.site_title,
                body.site_description,
                body.email,
                body.phone,
                body.address,
                body.social_facebook,
                body.social_twitter,
                body.social_instagram,
                body.social_github,
                body.social_linkedin,
                JSON.stringify(body.quick_links),
                body.background_color,
                body.text_color,
                body.link_color,
                body.link_hover_color,
                body.border_color,
                body.font_size,
                body.layout_columns,
                body.show_social_media,
                body.show_contact_info,
                body.show_quick_links,
                body.show_copyright,
                body.copyright_text
            ]);
            // 获取新创建的配置
            const [newConfigs] = await connection.execute('SELECT * FROM footer_config WHERE id = ?', [
                result.insertId
            ]);
            await connection.end();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newConfigs[0], {
                status: 201
            });
        }
    } catch (error) {
        console.error('更新页尾配置失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '更新页尾配置失败',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__55bc2efd._.js.map