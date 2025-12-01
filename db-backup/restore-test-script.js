#!/usr/bin/env node

/**
 * 数据库备份恢复测试脚本
 * 功能：定期测试备份文件的恢复功能，确保备份数据的可用性和完整性
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
  database: 'yueblog',
  testDatabase: 'yueblog_test_restore' // 测试恢复用的临时数据库
};

// 备份配置
const BACKUP_CONFIG = {
  // 备份目录
  localBackupDir: path.join(__dirname, 'backups'),
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
 * 获取最新的备份文件
 * @returns {string|null} 最新备份文件的路径
 */
function getLatestBackupFile() {
  console.log('🔍 查找最新的备份文件...');
  
  if (!fs.existsSync(BACKUP_CONFIG.localBackupDir)) {
    console.error('❌ 备份目录不存在:', BACKUP_CONFIG.localBackupDir);
    return null;
  }
  
  const files = fs.readdirSync(BACKUP_CONFIG.localBackupDir)
    .filter(file => file.endsWith('.zip'))
    .map(file => ({
      name: file,
      path: path.join(BACKUP_CONFIG.localBackupDir, file),
      mtime: fs.statSync(path.join(BACKUP_CONFIG.localBackupDir, file)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);
  
  if (files.length === 0) {
    console.error('❌ 没有找到备份文件');
    return null;
  }
  
  const latestFile = files[0];
  console.log(`✅ 找到最新备份文件: ${latestFile.name}`);
  console.log(`   修改时间: ${latestFile.mtime.toLocaleString('zh-CN')}`);
  
  return latestFile.path;
}

/**
 * 解压备份文件
 * @param {string} zipFilePath 压缩文件路径
 * @returns {string|null} 解压后的SQL文件路径
 */
function extractBackupFile(zipFilePath) {
  console.log('📦 解压备份文件...');
  
  const tempDir = path.join(__dirname, 'temp_restore');
  
  // 创建临时目录
  if (fs.existsSync(tempDir)) {
    // 清空临时目录
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });
  
  try {
    // 解压文件
    const extractCommand = `powershell Expand-Archive -Path "${zipFilePath}" -DestinationPath "${tempDir}" -Force`;
    console.log(`📌 执行解压命令: ${extractCommand}`);
    execSync(extractCommand, { stdio: 'inherit' });
    
    // 查找解压后的SQL文件
    const sqlFiles = fs.readdirSync(tempDir).filter(file => file.endsWith('.sql'));
    
    if (sqlFiles.length === 0) {
      console.error('❌ 解压后没有找到SQL文件');
      return null;
    }
    
    const sqlFilePath = path.join(tempDir, sqlFiles[0]);
    console.log(`✅ 解压成功: ${sqlFilePath}`);
    
    return sqlFilePath;
  } catch (error) {
    console.error('❌ 解压失败:', error.message);
    return null;
  }
}

/**
 * 创建测试数据库
 */
function createTestDatabase() {
  console.log('🗄️ 创建测试数据库...');
  
  try {
    // 先删除已存在的测试数据库
    const dropCommand = `mysql -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} -e "DROP DATABASE IF EXISTS ${DB_CONFIG.testDatabase};"`;
    execSync(dropCommand, { stdio: 'inherit' });
    
    // 创建新的测试数据库
    const createCommand = `mysql -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} -e "CREATE DATABASE ${DB_CONFIG.testDatabase};"`;
    execSync(createCommand, { stdio: 'inherit' });
    
    console.log(`✅ 测试数据库 ${DB_CONFIG.testDatabase} 创建成功`);
  } catch (error) {
    console.error('❌ 创建测试数据库失败:', error.message);
    throw error;
  }
}

/**
 * 恢复备份到测试数据库
 * @param {string} sqlFilePath SQL文件路径
 */
function restoreBackup(sqlFilePath) {
  console.log('🔄 恢复备份到测试数据库...');
  
  try {
    const restoreCommand = `mysql -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} ${DB_CONFIG.testDatabase} < "${sqlFilePath}"`;
    console.log(`📌 执行恢复命令: ${restoreCommand}`);
    execSync(restoreCommand, { stdio: 'inherit' });
    
    console.log('✅ 备份恢复成功');
  } catch (error) {
    console.error('❌ 备份恢复失败:', error.message);
    throw error;
  }
}

/**
 * 验证恢复的数据完整性
 * @returns {Object} 验证结果
 */
function verifyDataIntegrity() {
  console.log('🔍 验证数据完整性...');
  
  try {
    // 检查关键表是否存在（Prisma生成的表名是小写蛇形命名法）
    const tablesToCheck = ['user', 'category', 'post', 'comment'];
    const result = {
      success: true,
      details: {
        totalTables: 0,
        tablesFound: 0,
        tableData: {}
      }
    };
    
    // 获取所有表（使用更可靠的方式解析表名）
    const showTablesCommand = `mysql -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} ${DB_CONFIG.testDatabase} -N -e "SHOW TABLES;"`;
    const tablesOutput = execSync(showTablesCommand, { encoding: 'utf8' });
    const allTables = tablesOutput.split('\n').map(table => table.trim()).filter(Boolean);
    
    result.details.totalTables = allTables.length;
    
    // 检查每个表的数据行数
    for (const table of allTables) {
      // 跳过_prisma_migrations表
      if (table === '_prisma_migrations') {
        continue;
      }
      
      const countCommand = `mysql -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} ${DB_CONFIG.testDatabase} -N -e "SELECT COUNT(*) FROM ${table};"`;
      const countOutput = execSync(countCommand, { encoding: 'utf8' });
      const count = parseInt(countOutput.trim());
      
      result.details.tableData[table] = count;
      
      if (tablesToCheck.includes(table)) {
        result.details.tablesFound++;
      }
    }
    
    // 验证关键表是否都存在
    if (result.details.tablesFound !== tablesToCheck.length) {
      result.success = false;
      console.error(`❌ 关键表验证失败: 找到 ${result.details.tablesFound} 个，需要 ${tablesToCheck.length} 个`);
    } else {
      console.log(`✅ 所有关键表验证通过: ${result.details.tablesFound}/${tablesToCheck.length}`);
    }
    
    // 打印表数据统计
    console.log('📊 表数据统计:');
    for (const [table, count] of Object.entries(result.details.tableData)) {
      console.log(`   ${table}: ${count} 条记录`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ 数据完整性验证失败:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 清理测试资源
 */
function cleanupTestResources() {
  console.log('🧹 清理测试资源...');
  
  try {
    // 删除测试数据库
    const dropCommand = `mysql -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p${DB_CONFIG.password} -e "DROP DATABASE IF EXISTS ${DB_CONFIG.testDatabase};"`;
    execSync(dropCommand, { stdio: 'inherit' });
    
    // 删除临时目录
    const tempDir = path.join(__dirname, 'temp_restore');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    console.log('✅ 测试资源清理完成');
  } catch (error) {
    console.error('❌ 清理测试资源失败:', error.message);
  }
}

/**
 * 发送恢复测试结果通知
 * @param {Object} testResult 测试结果
 * @param {string} backupFile 备份文件路径
 */
function sendNotification(testResult, backupFile) {
  if (!BACKUP_CONFIG.notification.enable) {
    return;
  }
  
  console.log('📧 发送恢复测试结果通知...');
  
  const transporter = nodemailer.createTransport(BACKUP_CONFIG.notification.smtp);
  
  const mailOptions = {
    from: BACKUP_CONFIG.notification.from,
    to: BACKUP_CONFIG.notification.to,
    subject: testResult.success ? '✅ 数据库备份恢复测试成功' : '❌ 数据库备份恢复测试失败',
    html: `
      <h2>${testResult.success ? '✅ 数据库备份恢复测试成功' : '❌ 数据库备份恢复测试失败'}</h2>
      <p><strong>测试时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
      <p><strong>备份文件:</strong> ${path.basename(backupFile)}</p>
      <p><strong>备份路径:</strong> ${backupFile}</p>
      <p><strong>测试数据库:</strong> ${DB_CONFIG.testDatabase}</p>
      ${testResult.success ? `
        <h3>✅ 验证结果</h3>
        <p><strong>总表数:</strong> ${testResult.details.totalTables}</p>
        <p><strong>关键表找到:</strong> ${testResult.details.tablesFound}/4</p>
        <h4>表数据统计:</h4>
        <ul>
          ${Object.entries(testResult.details.tableData).map(([table, count]) => `<li><strong>${table}:</strong> ${count} 条记录</li>`).join('')}
        </ul>
      ` : `
        <h3>❌ 错误信息</h3>
        <p>${testResult.error}</p>
      `}
      <hr>
      <p>此邮件由数据库备份恢复测试系统发送，请勿回复。</p>
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
 * 主函数
 */
function main() {
  console.log('🚀 启动数据库备份恢复测试脚本...');
  console.log(`📅 当前时间: ${new Date().toLocaleString('zh-CN')}`);
  
  let testResult = {
    success: false
  };
  
  const backupFile = getLatestBackupFile();
  if (!backupFile) {
    console.error('❌ 找不到备份文件，恢复测试失败');
    return;
  }
  
  try {
    // 解压备份文件
    const sqlFilePath = extractBackupFile(backupFile);
    if (!sqlFilePath) {
      throw new Error('解压备份文件失败');
    }
    
    // 创建测试数据库
    createTestDatabase();
    
    // 恢复备份
    restoreBackup(sqlFilePath);
    
    // 验证数据完整性
    testResult = verifyDataIntegrity();
    
  } catch (error) {
    testResult = {
      success: false,
      error: error.message
    };
  } finally {
    // 清理测试资源
    cleanupTestResources();
    
    // 发送通知
    sendNotification(testResult, backupFile);
    
    console.log(`🎉 数据库备份恢复测试脚本执行完成，结果: ${testResult.success ? '成功' : '失败'}`);
    
    // 退出状态码
    process.exit(testResult.success ? 0 : 1);
  }
}

// 执行主函数
main();
