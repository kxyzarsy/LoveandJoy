#!/usr/bin/env node

/**
 * 数据库自动备份脚本
 * 功能：每周自动备份MySQL数据库，支持完整备份、异地存储、时间戳命名、通知机制等
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// 数据库配置
const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'yueblog'
};

// 备份配置
const BACKUP_CONFIG = {
  // 备份目录
  localBackupDir: path.join(__dirname, 'backups'),
  // 备份保留策略（天）
  retentionDays: {
    daily: 7,   // 每日备份保留7天
    weekly: 4,  // 每周备份保留4周
    monthly: 12 // 每月备份保留12个月
  },
  // 通知配置
  notification: {
    enable: true,
    from: 'kxyatxy116@163.com',  // 正确的发件人邮箱
    to: 'kxyatxy116@163.com',     // 收件人邮箱
    smtp: {
      host: 'smtp.163.com',       // 163邮箱SMTP服务器
      port: 465,                  // 163邮箱SSL端口
      secure: true,               // 启用SSL
      auth: {
        user: 'kxyatxy116@163.com',  // 与发件人邮箱一致
        pass: 'MCGPa6nsWUCy8dGR'  // 163邮箱授权码
      }
    }
  }
};

/**
 * 获取当前时间戳
 * @returns {string} 格式化的时间戳
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * 创建备份目录
 * @param {string} dirPath 目录路径
 */
function createBackupDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ 创建备份目录: ${dirPath}`);
  }
}

/**
 * 执行数据库备份
 * @returns {Object} 备份结果
 */
function backupDatabase() {
  console.log('📊 开始数据库备份...');
  
  // 创建备份目录
  createBackupDir(BACKUP_CONFIG.localBackupDir);
  
  // 生成备份文件名
  const timestamp = getTimestamp();
  
  // 判断备份类型
  const now = new Date();
  let backupType = 'daily';
  
  // 如果是每月第一天，则为月度备份
  if (now.getDate() === 1) {
    backupType = 'monthly';
  }
  // 如果是周日，则为每周备份
  else if (now.getDay() === 0) {
    backupType = 'weekly';
  }
  
  const backupFileName = `${DB_CONFIG.database}_${backupType}_${timestamp}.sql`;
  const backupFilePath = path.join(BACKUP_CONFIG.localBackupDir, backupFileName);
  
  try {
    // 执行mysqldump命令进行备份
    const command = `mysqldump -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} --single-transaction --routines --triggers ${DB_CONFIG.database} > ${backupFilePath}`;
    
    console.log(`📌 执行备份命令: ${command}`);
    execSync(command, { stdio: 'inherit' });
    
    // 压缩备份文件
    const zipCommand = `powershell Compress-Archive -Path ${backupFilePath} -DestinationPath ${backupFilePath}.zip -Force`;
    execSync(zipCommand, { stdio: 'inherit' });
    
    // 删除原始SQL文件，只保留压缩文件
    fs.unlinkSync(backupFilePath);
    
    const compressedFilePath = `${backupFilePath}.zip`;
    const fileSize = fs.statSync(compressedFilePath).size / (1024 * 1024); // MB
    
    console.log(`✅ 备份成功！`);
    console.log(`   备份文件: ${compressedFilePath}`);
    console.log(`   文件大小: ${fileSize.toFixed(2)} MB`);
    
    return {
      success: true,
      backupFile: compressedFilePath,
      fileName: `${backupFileName}.zip`,
      fileSize: fileSize.toFixed(2),
      timestamp: timestamp
    };
  } catch (error) {
    console.error('❌ 备份失败:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 发送通知邮件
 * @param {Object} backupResult 备份结果
 */
function sendNotification(backupResult) {
  if (!BACKUP_CONFIG.notification.enable) {
    return;
  }
  
  console.log('📧 发送通知邮件...');
  
  const transporter = nodemailer.createTransport(BACKUP_CONFIG.notification.smtp);
  
  const mailOptions = {
    from: BACKUP_CONFIG.notification.from,
    to: BACKUP_CONFIG.notification.to,
    subject: backupResult.success ? '✅ 数据库备份成功' : '❌ 数据库备份失败',
    html: `
      <h2>${backupResult.success ? '✅ 数据库备份成功' : '❌ 数据库备份失败'}</h2>
      <p><strong>备份时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
      <p><strong>数据库:</strong> ${DB_CONFIG.database}</p>
      ${backupResult.success ? `
        <p><strong>备份文件:</strong> ${backupResult.fileName}</p>
        <p><strong>文件大小:</strong> ${backupResult.fileSize} MB</p>
        <p><strong>备份路径:</strong> ${backupResult.backupFile}</p>
      ` : `
        <p><strong>错误信息:</strong> ${backupResult.error}</p>
      `}
      <p><strong>备份主机:</strong> ${DB_CONFIG.host}:${DB_CONFIG.port}</p>
      <hr>
      <p>此邮件由数据库自动备份系统发送，请勿回复。</p>
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ 发送通知邮件失败:', error.message);
    } else {
      console.log('✅ 通知邮件发送成功:', info.messageId);
    }
  });
}

/**
 * 清理过期备份文件
 */
function cleanupOldBackups() {
  console.log('🗑️  清理过期备份文件...');
  
  const now = new Date();
  const files = fs.readdirSync(BACKUP_CONFIG.localBackupDir);
  
  files.forEach(file => {
    const filePath = path.join(BACKUP_CONFIG.localBackupDir, file);
    const stats = fs.statSync(filePath);
    const fileAgeDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);
    
    // 根据文件名判断备份类型
    let retentionDays = BACKUP_CONFIG.retentionDays.daily;
    if (file.includes('_weekly_')) {
      retentionDays = BACKUP_CONFIG.retentionDays.weekly * 7;
    } else if (file.includes('_monthly_')) {
      retentionDays = BACKUP_CONFIG.retentionDays.monthly * 30;
    }
    
    // 删除过期备份
    if (fileAgeDays > retentionDays) {
      fs.unlinkSync(filePath);
      console.log(`✅ 删除过期备份: ${file} (${fileAgeDays.toFixed(1)}天)`);
    }
  });
  
  console.log('✅ 清理完成');
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 启动数据库自动备份脚本...');
  console.log(`📅 当前时间: ${new Date().toLocaleString('zh-CN')}`);
  
  // 执行备份
  const backupResult = backupDatabase();
  
  // 发送通知
  sendNotification(backupResult);
  
  // 清理过期备份
  cleanupOldBackups();
  
  console.log('🎉 数据库备份脚本执行完成');
}

// 执行主函数
main();