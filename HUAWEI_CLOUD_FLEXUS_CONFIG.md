# 华为云 Flexus L实例-2核2G2M 1年 配置指南

## 一、购买前准备
1. **注册华为云账号**：访问 [华为云官网](https://www.huaweicloud.com/) 完成注册
2. **实名认证**：登录后在控制台完成实名认证（个人/企业）
3. **充值或领取优惠券**：确保账户有足够余额或适用的优惠券

## 二、购买实例步骤

### 1. 进入购买页面
- 登录华为云控制台，点击顶部导航栏的 **"产品"**
- 选择 **"弹性云服务器 ECS"**
- 在 ECS 页面点击 **"立即购买"**

### 2. 配置实例

#### （1）计费模式与区域
- **计费模式**：选择 **"包年/包月"**
- **区域**：根据业务需求选择（建议选择靠近目标用户的区域，如华东-上海一）
- **可用区**：默认或选择推荐可用区

#### （2）规格选择
- **实例类型**：选择 **"通用型"**
- **规格**：选择 **"Flexus L实例"**，然后选择 **"2核2G"** 配置

#### （3）镜像选择
- 系统镜像：根据需求选择，推荐：
  - 生产环境：CentOS 7.9 / Ubuntu 20.04 LTS
  - 开发测试：根据项目技术栈选择
- 镜像类型：公共镜像（稳定可靠）

#### （4）存储配置
- **系统盘**：默认配置即可（一般40GB SSD）
- **数据盘**：根据业务需求添加（可选，建议至少20GB）

#### （5）网络配置
- **虚拟私有云**：选择现有VPC或创建新VPC
- **子网**：选择现有子网或创建新子网
- **公网IP**：选择 **"分配公网IP"**
- **带宽**：选择 **"按固定带宽"**，设置为 **2M**
- **安全组**：选择现有安全组或创建新安全组（需开放22端口用于SSH登录）

#### （6）登录方式
- 选择 **"密码"** 或 **"密钥对"** 登录
  - 密码：设置登录密码（强密码，包含大小写字母、数字、特殊字符）
  - 密钥对：创建或选择现有密钥对（更安全）

#### （7）实例名称与数量
- **实例名称**：自定义名称（如：flexus-l-2c2g2m）
- **购买时长**：选择 **"1年"**
- **数量**：1

### 3. 确认购买
- 勾选 **"我已阅读并同意《弹性云服务器服务协议》"**
- 点击 **"立即购买"**
- 完成支付流程

## 三、实例初始化配置

### 1. 登录实例
- 使用SSH工具（如PuTTY、Xshell）连接实例
- 登录命令：`ssh root@公网IP`
- 输入密码或使用密钥对登录

### 2. 系统初始化

#### （1）更新系统
```bash
# CentOS
yum update -y

# Ubuntu
sudo apt update && sudo apt upgrade -y
```

#### （2）安装必要软件
```bash
# 安装常用工具
# CentOS
yum install -y wget curl vim git

# Ubuntu
sudo apt install -y wget curl vim git
```

#### （3）配置防火墙
```bash
# CentOS 7+（使用firewalld）
firewall-cmd --add-port=22/tcp --permanent
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --add-port=443/tcp --permanent
firewall-cmd --reload

# Ubuntu（使用ufw）
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

#### （4）配置Swap（可选，2G内存建议配置）
```bash
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 永久生效
echo "/swapfile swap swap defaults 0 0" >> /etc/fstab
```

## 四、部署应用（以Next.js项目为例）

### 1. 安装Node.js
```bash
# 使用nvm安装（推荐）
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 验证
node -v
npm -v
```

### 2. 安装PM2（进程管理）
```bash
npm install -g pm2
```

### 3. 部署项目
```bash
# 克隆代码
git clone <你的仓库地址> /opt/your-project
cd /opt/your-project

# 安装依赖
npm install

# 构建项目
npm run build

# 开发环境启动
npm run dev

# 生产环境启动（直接启动）
npm start

# 使用PM2管理（推荐生产环境）
pm2 start npm --name "your-project" -- start
```

### 4. 配置Nginx反向代理（可选）
```bash
# 安装Nginx
# CentOS
yum install -y nginx

# Ubuntu
sudo apt install -y nginx

# 启动Nginx
systemctl start nginx
systemctl enable nginx

# 配置反向代理
vim /etc/nginx/conf.d/your-project.conf
```

在配置文件中添加：
```nginx
server {
    listen 80;
    server_name 你的域名或公网IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

重新加载Nginx：
```bash
nginx -t  # 测试配置
nginx -s reload  # 重新加载
```

## 五、监控与维护

### 1. 登录华为云控制台监控
- 在ECS控制台查看实例状态、CPU、内存、带宽使用情况
- 设置告警规则（如CPU使用率超过80%时告警）

### 2. 定期维护
- 每周检查系统更新
- 每月备份重要数据
- 定期查看日志文件
- 优化应用性能

## 六、常见问题排查

1. **无法连接实例**：
   - 检查安全组是否开放22端口
   - 检查公网IP是否正确
   - 检查本地网络是否正常

2. **应用访问缓慢**：
   - 检查CPU/内存使用率
   - 优化应用代码
   - 考虑升级实例规格

3. **数据丢失**：
   - 定期备份数据到OBS或其他存储服务
   - 配置快照策略

## 七、注意事项

1. **安全组配置**：仅开放必要端口，定期检查安全组规则
2. **密码管理**：定期更换密码，使用强密码策略
3. **备份策略**：配置自动快照和数据备份
4. **成本控制**：关注实例使用情况，避免资源浪费
5. **合规性**：确保业务符合华为云服务条款和相关法律法规

## 八、参考资源

- [华为云ECS官方文档](https://support.huaweicloud.com/ecs/index.html)
- [华为云Flexus实例介绍](https://www.huaweicloud.com/product/flexus.html)
- [Nginx官方文档](https://nginx.org/en/docs/)
- [Next.js部署指南](https://nextjs.org/docs/deployment)

---

配置完成后，您的华为云Flexus L实例-2核2G2M 1年即可正常使用。根据您的具体业务需求，还可以进行更多个性化配置和优化。