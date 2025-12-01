# 博客系统数据库表结构

## 1. 文章表 (posts)

| 字段名 | 数据类型 | 描述 | 约束 |
|-------|---------|------|------|
| id | INT | 文章ID | 主键，自增 |
| title | VARCHAR(255) | 文章标题 | NOT NULL |
| excerpt | TEXT | 文章摘要 | NOT NULL |
| content | TEXT | 文章内容 | NOT NULL |
| categoryId | INT | 分类ID | NOT NULL，外键关联categories表 |
| image | VARCHAR(255) | 文章图片URL | NULL |
| status | ENUM | 文章状态 | NOT NULL，可选值：published（已发布）、pending（待审核）、rejected（已拒绝） |
| foundSensitiveWords | JSON | 检测到的违禁词列表 | NOT NULL，默认空数组 |
| createdAt | DATETIME | 创建时间 | NOT NULL，默认当前时间 |
| authorId | INT | 作者ID | NOT NULL，外键关联users表 |
| reviewedBy | INT | 审核人ID | NULL，外键关联users表 |
| reviewedAt | DATETIME | 审核时间 | NULL |
| rejectionReason | TEXT | 拒绝原因 | NULL |
| likes | INT | 点赞数 | NOT NULL，默认0 |

## 2. 用户表 (users)

| 字段名 | 数据类型 | 描述 | 约束 |
|-------|---------|------|------|
| id | INT | 用户ID | 主键，自增 |
| name | VARCHAR(100) | 用户名 | NOT NULL |
| username | VARCHAR(50) | 登录用户名 | NOT NULL，唯一 |
| email | VARCHAR(100) | 邮箱 | NOT NULL，唯一 |
| password | VARCHAR(255) | 密码哈希 | NOT NULL |
| avatar | VARCHAR(255) | 头像URL | NULL，默认占位图 |
| bio | TEXT | 个人简介 | NULL |
| role | ENUM | 用户角色 | NOT NULL，可选值：admin（管理员）、user（普通用户） |
| createdAt | DATETIME | 注册时间 | NOT NULL，默认当前时间 |
| lastLoginAt | DATETIME | 最后登录时间 | NULL |

## 3. 分类表 (categories)

| 字段名 | 数据类型 | 描述 | 约束 |
|-------|---------|------|------|
| id | INT | 分类ID | 主键，自增 |
| name | VARCHAR(50) | 分类名称 | NOT NULL，唯一 |
| slug | VARCHAR(50) | 分类别名 | NOT NULL，唯一 |
| description | TEXT | 分类描述 | NULL |
| createdAt | DATETIME | 创建时间 | NOT NULL，默认当前时间 |

## 4. 评论表 (comments)

| 字段名 | 数据类型 | 描述 | 约束 |
|-------|---------|------|------|
| id | INT | 评论ID | 主键，自增 |
| postId | INT | 文章ID | NOT NULL，外键关联posts表 |
| content | TEXT | 评论内容 | NOT NULL |
| authorId | INT | 评论作者ID | NOT NULL，外键关联users表 |
| parentId | INT | 父评论ID | NULL，用于回复功能 |
| createdAt | DATETIME | 创建时间 | NOT NULL，默认当前时间 |
| status | ENUM | 评论状态 | NOT NULL，可选值：approved（已通过）、pending（待审核）、rejected（已拒绝） |

## 5. 点赞表 (likes)

| 字段名 | 数据类型 | 描述 | 约束 |
|-------|---------|------|------|
| id | INT | 点赞ID | 主键，自增 |
| postId | INT | 文章ID | NOT NULL，外键关联posts表 |
| userId | INT | 用户ID | NOT NULL，外键关联users表 |
| createdAt | DATETIME | 点赞时间 | NOT NULL，默认当前时间 |
| UNIQUE KEY | (postId, userId) | 确保同一用户对同一文章只能点赞一次 |

## 6. 违禁词表 (sensitive_words)

| 字段名 | 数据类型 | 描述 | 约束 |
|-------|---------|------|------|
| id | INT | 违禁词ID | 主键，自增 |
| word | VARCHAR(50) | 违禁词 | NOT NULL，唯一 |
| category | VARCHAR(50) | 违禁词类别 | NULL，如：政治、色情、暴力等 |
| createdAt | DATETIME | 添加时间 | NOT NULL，默认当前时间 |

## 7. 系统配置表 (settings)

| 字段名 | 数据类型 | 描述 | 约束 |
|-------|---------|------|------|
| id | INT | 配置ID | 主键，自增 |
| key | VARCHAR(50) | 配置键 | NOT NULL，唯一 |
| value | TEXT | 配置值 | NOT NULL |
| description | VARCHAR(255) | 配置描述 | NULL |

## 数据关系

- 一个用户可以发布多篇文章（一对多关系：users → posts）
- 一个分类可以包含多篇文章（一对多关系：categories → posts）
- 一篇文章可以有多个评论（一对多关系：posts → comments）
- 一个评论可以有多个回复（自关联关系：comments → comments）
- 一篇文章可以有多个点赞（一对多关系：posts → likes）
- 一个用户可以对多篇文章点赞（一对多关系：users → likes）

## 当前实现说明

目前系统使用全局变量模拟数据库存储，主要存储在以下文件中：

1. 文章数据：`src/app/api/posts/route.ts` - 全局变量 `posts`
2. 用户数据：`src/app/admin/users/page.tsx` - 模拟数据 `mockUsers`
3. 分类数据：`src/app/admin/categories/page.tsx` - 模拟数据
4. 违禁词：`src/utils/违禁词检测.ts` - 数组 `sensitiveWords`

## 未来改进建议

1. 替换全局变量存储为实际数据库（如MySQL、PostgreSQL、MongoDB等）
2. 添加数据库迁移和种子数据功能
3. 实现完整的CRUD API
4. 添加数据验证和错误处理
5. 实现数据缓存机制，提高性能
6. 添加数据备份和恢复功能
