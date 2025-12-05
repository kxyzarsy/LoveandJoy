#!/bin/bash
# 项目目录（已确认是你的路径）
PROJECT_DIR="/home/ubuntu/LoveandJoy"
# GitHub仓库地址（你的仓库）
GIT_REPO="https://github.com/kxyzarsy/LoveandJoy.git"

# 进入项目目录
cd $PROJECT_DIR

# 1. 拉取GitHub上本地推送的最新代码
git pull origin main

# 2. 安装新依赖（Node.js项目，国内源加速）
npm install --registry https://registry.npm.mirror.com

# 3. 重启应用（假设你的入口文件是app.js，若不是请替换！）
# 先检查pm2是否安装，没装的话先执行：sudo npm install pm2 -g
pm2 restart app.js  # 替换成你的实际入口文件（如index.js/route.ts）

# 4. 记录同步日志（方便排查问题）
echo "同步时间：$(date +"%Y-%m-%d %H:%M:%S") → 代码拉取成功，应用已重启" >> sync_log.txt
