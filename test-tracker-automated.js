// 自动化测试脚本 - 用户操作记录脚本
// 使用 Puppeteer 进行自动化测试

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testUserOperationTracker() {
  console.log('📊 开始测试用户操作记录脚本...');
  
  let browser;
  let page;
  
  try {
    // 启动浏览器
    console.log('🚀 启动浏览器...');
    browser = await puppeteer.launch({
      headless: false, // 非无头模式，便于观察测试过程
      slowMo: 100, // 减慢操作速度，便于观察
      defaultViewport: { width: 1200, height: 800 }
    });
    
    // 创建新页面
    page = await browser.newPage();
    
    // 启用控制台日志
    page.on('console', msg => {
      const msgType = msg.type();
      const msgText = msg.text();
      
      switch (msgType) {
        case 'log':
          console.log(`📝 ${msgText}`);
          break;
        case 'error':
          console.error(`❌ ${msgText}`);
          break;
        case 'warning':
          console.warn(`⚠️  ${msgText}`);
          break;
        case 'info':
          console.info(`ℹ️  ${msgText}`);
          break;
        default:
          console.log(`📌 ${msgText}`);
      }
    });
    
    // 导航到测试页面
    console.log('🌐 导航到测试页面...');
    await page.goto('http://localhost:3000/test-tracker.html', {
      waitUntil: 'networkidle2'
    });
    
    // 等待页面加载完成
    await page.waitForSelector('#log-container');
    console.log('✅ 页面加载完成');
    
    // 步骤1：开始记录
    console.log('\n📌 步骤1：开始记录');
    await page.evaluate(() => {
      window.userOperationTracker.start();
    });
    
    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 步骤2：模拟用户操作
    console.log('\n📌 步骤2：模拟用户操作');
    
    // 2.1 点击测试按钮
    console.log('   2.1 点击测试按钮...');
    await page.click('#btn1');
    await page.click('#btn2');
    await page.click('#btn3');
    
    // 2.2 输入文本
    console.log('   2.2 输入文本...');
    await page.type('#text-input', '测试输入文本');
    await page.type('#textarea', '测试多行文本\n第二行\n第三行');
    
    // 2.3 动态添加元素
    console.log('   2.3 动态添加元素...');
    await page.click('button[onclick="addDynamicElement()"]');
    await page.click('button[onclick="addDynamicElement()"]');
    
    // 2.4 修改动态内容
    console.log('   2.4 修改动态内容...');
    await page.click('button[onclick="modifyDynamicContent()"]');
    
    // 2.5 右键点击
    console.log('   2.5 右键点击...');
    await page.click('div[style*="background-color: #e3f2fd"]', { button: 'right' });
    
    // 2.6 双击
    console.log('   2.6 双击...');
    await page.click('div[style*="background-color: #e8f5e8"]', { clickCount: 2 });
    
    // 等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 步骤3：停止记录
    console.log('\n📌 步骤3：停止记录');
    await page.evaluate(() => {
      window.userOperationTracker.stop();
    });
    
    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 步骤4：导出数据
    console.log('\n📌 步骤4：导出数据');
    
    // 监听下载事件
    const client = await page.target().createCDPSession();
    await client.send('Browser.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: path.resolve(__dirname, 'downloads')
    });
    
    // 创建下载目录
    if (!fs.existsSync(path.resolve(__dirname, 'downloads'))) {
      fs.mkdirSync(path.resolve(__dirname, 'downloads'));
    }
    
    // 导出数据
    await page.evaluate(() => {
      window.userOperationTracker.exportData();
    });
    
    // 等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 步骤5：检查导出的数据
    console.log('\n📌 步骤5：检查导出的数据');
    
    const downloadDir = path.resolve(__dirname, 'downloads');
    const files = fs.readdirSync(downloadDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      throw new Error('❌ 没有找到导出的JSON文件');
    }
    
    console.log(`✅ 找到导出的JSON文件：${jsonFiles[jsonFiles.length - 1]}`);
    
    // 读取最新的JSON文件
    const latestFile = path.join(downloadDir, jsonFiles[jsonFiles.length - 1]);
    const jsonData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    
    console.log(`✅ 导出的数据包含 ${jsonData.operations.length} 个操作记录`);
    console.log(`✅ 导出的数据格式正确，包含 metadata 和 operations 字段`);
    
    // 验证数据结构
    if (!jsonData.metadata || !jsonData.operations) {
      throw new Error('❌ 导出的数据格式不正确');
    }
    
    // 步骤6：回放操作
    console.log('\n📌 步骤6：回放操作');
    
    // 清除之前的操作数据
    await page.evaluate(() => {
      window.userOperationTracker.clearData();
    });
    
    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 重新开始记录
    await page.evaluate(() => {
      window.userOperationTracker.start();
    });
    
    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 回放操作
    await page.evaluate(() => {
      window.userOperationTracker.playback();
    });
    
    // 等待5秒，让回放完成
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 停止记录
    await page.evaluate(() => {
      window.userOperationTracker.stop();
    });
    
    // 步骤7：销毁脚本
    console.log('\n📌 步骤7：销毁脚本');
    await page.evaluate(() => {
      window.userOperationTracker.destroy();
    });
    
    // 验证脚本是否已销毁
    const isDestroyed = await page.evaluate(() => {
      return typeof window.userOperationTracker === 'undefined';
    });
    
    if (isDestroyed) {
      console.log('✅ 脚本已成功销毁');
    } else {
      throw new Error('❌ 脚本销毁失败');
    }
    
    // 等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 测试完成
    console.log('\n🎉 所有测试通过！用户操作记录脚本功能正常。');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ 测试失败：', error);
    return false;
  } finally {
    // 关闭浏览器
    if (browser) {
      await browser.close();
    }
    
    console.log('\n📋 测试完成。');
  }
}

// 安装 Puppeteer 并运行测试
async function runTest() {
  try {
    // 检查是否已安装 Puppeteer
    try {
      require('puppeteer');
      console.log('✅ Puppeteer 已安装');
    } catch (error) {
      console.log('📦 正在安装 Puppeteer...');
      const { execSync } = require('child_process');
      execSync('npm install puppeteer', { stdio: 'inherit' });
      console.log('✅ Puppeteer 安装完成');
    }
    
    // 运行测试
    await testUserOperationTracker();
  } catch (error) {
    console.error('❌ 测试过程中发生错误：', error);
  }
}

// 启动测试
runTest();