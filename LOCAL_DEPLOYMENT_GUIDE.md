# 本地部署指南

本指南将帮助您在本地环境部署 LoveandJoy 博客项目，无需使用云服务，完全免费。

## 前提条件

在开始之前，请确保您的本地环境已安装以下软件：

- Node.js 18+（推荐使用 Node.js 20）
- npm 或 yarn 或 pnpm
- MySQL 数据库（推荐使用 MySQL 8.0）

## 部署步骤

### 1. 克隆或准备项目

如果您还没有项目代码，请先克隆或下载项目到本地：

```bash
git clone <项目仓库地址>
cd LoveandJoy
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env` 文件并根据您的本地环境进行配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置您的本地数据库连接信息：

```env
# 数据库配置
DATABASE_URL="mysql://root:123456@localhost:3306/myblog"

# 邮件服务配置（可选，用于密码重置等功能）
EMAIL_SERVICE=smtp.qq.com
EMAIL_HOST=smtp.qq.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@qq.com
EMAIL_PASS=your-email-password-or-authorization-code
```

### 4. 初始化数据库

运行 Prisma 迁移命令，创建数据库表结构：

```bash
npx prisma migrate dev --name init
```

### 5. 构建生产版本

```bash
npm run build
```

### 6. 启动生产服务器

```bash
npm run start
```

服务器将在 `http://localhost:3000` 启动。

## 访问项目

打开浏览器，访问 `http://localhost:3000` 即可查看您的博客项目。

## 可选：配置本地域名

如果您想使用自定义本地域名（如 `blog.local`）访问项目，可以修改 hosts 文件：

1. 打开 hosts 文件：
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - macOS/Linux: `/etc/hosts`

2. 添加以下条目：
   ```
   127.0.0.1 blog.local
   ```

3. 保存文件后，即可通过 `http://blog.local:3000` 访问项目。

## 可选：使用 PM2 管理进程（高级）

如果您希望项目在后台持续运行，可以使用 PM2 进行进程管理。首先需要安装 PM2：

```bash
npm install -g pm2
```

然后使用 PM2 直接启动项目：

```bash
npm run build
pm2 start npm --name "loveandjoy" -- run start
```

### PM2 常用命令

```bash
# 查看进程状态
pm2 status

# 查看日志
pm2 logs loveandjoy

# 重启项目
pm2 restart loveandjoy

# 停止项目
pm2 stop loveandjoy

# 从 PM2 列表中移除
pm2 delete loveandjoy
```

## 数据库管理

### 查看数据库内容

使用 Prisma Studio 可视化管理数据库：

```bash
npx prisma studio
```

然后访问 `http://localhost:5555` 即可管理数据库。

### 备份数据库

```bash
mysqldump -u root -p myblog > backup_$(date +%Y%m%d).sql
```

### 恢复数据库

```bash
mysql -u root -p myblog < backup_20251202.sql
```

## 常见问题

### 1. 端口被占用

如果 3000 端口被占用，可以修改启动端口：

```bash
PORT=3001 npm run start
```

### 2. 数据库连接失败

请检查：
- MySQL 服务是否正在运行
- 数据库用户名和密码是否正确
- 数据库名称是否存在
- 数据库端口是否正确

### 3. 项目无法访问

请检查：
- 服务器是否正在运行
- 防火墙是否允许 3000 端口访问
- 浏览器地址是否正确

## 更新项目

当您需要更新项目代码时，执行以下步骤：

1. 拉取最新代码：
   ```bash
   git pull
   ```

2. 安装新依赖：
   ```bash
   npm install
   ```

3. 运行数据库迁移（如果有）：
   ```bash
   npx prisma migrate dev
   ```

4. 重新构建并启动：
   ```bash
   npm run build
   npm run start
   ```

## 总结

通过以上步骤，您可以在本地环境成功部署 LoveandJoy 博客项目。这种方式完全免费，适合个人使用或小型团队内部测试。

如果您在部署过程中遇到任何问题，请查看项目的错误日志或联系开发者获取帮助。
