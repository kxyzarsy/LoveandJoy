module.exports = [
"[project]/src/generated/prisma/client.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_node:buffer_36d4cdcf._.js",
  "server/chunks/[root-of-the-server]__c990d05e._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/generated/prisma/client.ts [app-route] (ecmascript)");
    });
});
}),
];