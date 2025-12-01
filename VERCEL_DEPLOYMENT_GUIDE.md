# Vercel 免费方案部署指南

本指南详细说明如何使用 Vercel 平台的免费方案部署当前项目。

## 1. 项目准备要求

### 1.1 技术栈要求
- **Next.js 16**：项目基于 Next.js 16 构建
- **TypeScript**：使用 TypeScript 开发
- **Prisma ORM**：用于数据库操作
- **MySQL 数据库**：项目使用 MySQL 数据库

### 1.2 必要的环境变量

| 环境变量名 | 描述 | 示例值 |
|------------|------|--------|
| `DATABASE_URL` | 数据库连接 URL | `mysql://user:password@host:port/database` |
| `JWT_SECRET` | JWT 签名密钥 | `your-secret-key-here` |
| `SUPABASE_URL` | Supabase 项目 URL | `https://your-project.supabase.co` |
| `SUPABASE_KEY` | Supabase API 密钥 | `your-supabase-key-here` |
| `SMTP_HOST` | SMTP 服务器地址 | `smtp.example.com` |
| `SMTP_PORT` | SMTP 服务器端口 | `587` |
| `SMTP_USER` | SMTP 用户名 | `your-email@example.com` |
| `SMTP_PASSWORD` | SMTP 密码 | `your-smtp-password` |
| `SMTP_FROM` | 发件人邮箱 | `your-email@example.com` |

### 1.3 代码仓库要求
- 项目代码已推送到 GitHub、GitLab 或 Bitbucket 仓库
- 仓库包含完整的项目代码，包括 `package.json`、`next.config.ts` 等配置文件
- 确保 `.gitignore` 文件已正确配置，排除不需要部署的文件（如 `node_modules`、`.env` 等）

## 2. 与 Vercel 账户的连接步骤

### 2.1 创建 Vercel 账户
1. 访问 [Vercel 官网](https://vercel.com/)
2. 点击 "Sign Up" 按钮
3. 选择使用 GitHub、GitLab 或 Bitbucket 账号登录，或使用邮箱注册
4. 完成注册流程，进入 Vercel 控制台

### 2.2 连接代码仓库
1. 在 Vercel 控制台，点击 "Add New" → "Project"
2. 在 "Import Git Repository" 页面，选择你的代码仓库平台（GitHub、GitLab 或 Bitbucket）
3. 按照提示授权 Vercel 访问你的代码仓库
4. 授权完成后，选择要部署的项目仓库
5. 点击 "Import" 按钮，进入项目配置页面

## 3. 部署配置设置

### 3.1 基本配置
- **Framework Preset**：选择 "Next.js"
- **Root Directory**：保持默认（项目根目录）
- **Build Command**：保持默认（`npm run build`）
- **Output Directory**：保持默认（`.next`）
- **Install Command**：保持默认（`npm install`）

### 3.2 环境变量配置
在 "Environment Variables" 部分，添加项目所需的环境变量：

1. 点击 "Add" 按钮，逐个添加环境变量
2. 输入环境变量名和对应的值
3. 确保勾选 "Add to all environments"（开发、预览、生产环境）
4. 完成所有环境变量的添加后，点击 "Deploy" 按钮开始部署

### 3.3 高级配置（可选）
- **Node.js Version**：选择与本地开发环境一致的 Node.js 版本（建议使用 Node.js 18 或更高版本）
- **Build Cache**：保持默认启用状态，加速构建过程
- **Git Integration**：保持默认启用状态，自动部署新的代码提交

## 4. 部署流程

### 4.1 首次部署
1. 完成配置后，点击 "Deploy" 按钮
2. Vercel 将开始执行以下步骤：
   - 克隆代码仓库
   - 安装依赖（`npm install`）
   - 构建项目（`npm run build`）
   - 部署构建产物
3. 部署过程中，可以在控制台查看实时日志
4. 部署完成后，会显示部署成功的提示和访问 URL

### 4.2 自动部署
- 当你向仓库的主分支（默认为 `main` 或 `master`）推送新代码时，Vercel 会自动触发新的部署
- 你也可以在 Vercel 控制台手动触发部署

### 4.3 预览部署
- 当你创建新的分支并推送代码时，Vercel 会自动为该分支创建预览部署
- 预览部署的 URL 会在 GitHub/GitLab/Bitbucket 的 Pull Request 或 Merge Request 中显示

## 5. 部署后的验证方法

### 5.1 访问部署的应用
1. 部署完成后，Vercel 会提供一个访问 URL（格式：`https://your-project.vercel.app`）
2. 在浏览器中访问该 URL，检查应用是否正常运行
3. 测试主要功能，如：
   - 首页加载是否正常
   - 文章列表和详情页是否可访问
   - 用户登录/注册功能是否正常
   - 管理后台是否可访问

### 5.2 检查构建日志
1. 在 Vercel 控制台，进入项目的 "Deployments" 页面
2. 点击最新的部署记录
3. 查看构建日志，确保没有错误或警告
4. 检查部署状态是否为 "Ready"

### 5.3 测试 API 端点
- 使用 Postman 或 curl 测试 API 端点，确保它们能正常响应
- 例如：`curl https://your-project.vercel.app/api/posts`

## 6. 免费方案的资源限制

### 6.1 计算资源限制
- **构建时间**：每月 100 小时的构建时间
- **服务器less 函数执行时间**：每个函数最多执行 10 秒
- **服务器less 函数调用次数**：每月 100 万次调用
- **带宽**：每月 100GB 带宽

### 6.2 存储限制
- **边缘配置**：每月 1000 次更新
- **边缘中间件**：每月 100 万次调用

### 6.3 数据库限制
- Vercel 免费方案不提供数据库服务，需要使用外部数据库（如 PlanetScale、Supabase、AWS RDS 等）
- 建议使用 PlanetScale 的免费方案，与 Vercel 集成良好

### 6.4 适用场景
- 个人博客或小型网站
- 开发和测试环境
- 小型企业网站
- 原型和演示项目

### 6.5 不适用场景
- 高流量网站（超过每月 100 万次访问）
- 需要长时间运行的服务器less 函数
- 大型企业应用
- 需要大量存储的应用

## 7. 常见问题和解决方案

### 7.1 构建失败

**问题**：构建过程中出现错误，导致部署失败

**解决方案**：
1. 查看构建日志，找出具体错误信息
2. 常见错误及解决方法：
   - **依赖安装失败**：检查 `package.json` 文件，确保依赖版本兼容
   - **构建命令错误**：确保 `package.json` 中的 `build` 脚本正确
   - **环境变量缺失**：检查是否所有必要的环境变量都已添加
   - **TypeScript 错误**：修复代码中的 TypeScript 错误
   - **Prisma 迁移错误**：确保数据库迁移已正确执行

### 7.2 应用无法访问

**问题**：部署成功后，访问应用时出现错误

**解决方案**：
1. 检查应用的访问 URL 是否正确
2. 查看 Vercel 控制台的 "Logs" 页面，找出错误信息
3. 常见错误及解决方法：
   - **数据库连接错误**：检查 `DATABASE_URL` 环境变量是否正确
   - **JWT 签名错误**：检查 `JWT_SECRET` 环境变量是否设置
   - **Supabase 连接错误**：检查 `SUPABASE_URL` 和 `SUPABASE_KEY` 环境变量是否正确
   - **SMTP 配置错误**：检查 SMTP 相关环境变量是否正确

### 7.3 服务器less 函数超时

**问题**：API 端点响应时间超过 10 秒，导致超时错误

**解决方案**：
1. 优化 API 函数的性能，减少执行时间
2. 将耗时操作拆分为多个函数
3. 使用异步处理方式
4. 考虑升级到 Vercel 的付费方案，获得更长的函数执行时间

### 7.4 带宽超限

**问题**：每月带宽使用超过 100GB，导致访问受限

**解决方案**：
1. 优化静态资源，减少文件大小
2. 使用 CDN 加速静态资源访问
3. 考虑升级到 Vercel 的付费方案，获得更多带宽

### 7.5 构建时间超限

**问题**：每月构建时间超过 100 小时，导致构建失败

**解决方案**：
1. 减少不必要的构建次数
2. 优化构建过程，减少构建时间
3. 考虑升级到 Vercel 的付费方案，获得更多构建时间

## 8. 额外建议

### 8.1 数据库配置
- 建议使用 PlanetScale 作为数据库，与 Vercel 集成良好，且提供免费方案
- 确保数据库允许来自 Vercel 服务器的连接
- 定期备份数据库，防止数据丢失

### 8.2 监控和日志
- 启用 Vercel 的日志功能，监控应用的运行状态
- 考虑使用第三方监控工具，如 Sentry，监控应用错误

### 8.3 安全性
- 确保所有环境变量都已正确配置，且不包含敏感信息
- 定期更新依赖，修复安全漏洞
- 启用 HTTPS，确保数据传输安全
- 配置适当的 CORS 策略

### 8.4 性能优化
- 优化 Next.js 应用的性能，如使用静态生成（SSG）、增量静态再生（ISR）等
- 优化图片资源，使用 Next.js 的 Image 组件
- 启用缓存策略，减少服务器负载

## 9. 总结

使用 Vercel 的免费方案部署 Next.js 项目是一个简单、高效的选择，特别适合个人博客、小型网站和测试环境。通过本指南，你可以轻松完成项目的部署，并了解部署过程中的常见问题和解决方案。

如果你的项目需要更多的资源或高级功能，可以考虑升级到 Vercel 的付费方案，获得更多的计算资源、存储空间和高级功能。