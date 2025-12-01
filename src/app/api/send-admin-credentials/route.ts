import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * 发送管理员凭证邮件的API路由
 * 用于定期发送管理员登录凭证和测试邮件发送
 */
export async function POST(request: Request) {
  try {
    const { isTest = false } = await request.json();
    
    // 管理员凭证信息
    const adminCredentials = {
      accessUrl: '/admin/secret-login',
      initialPassword: 'admin-portal',
      username: 'admin',
      password: 'admin123',
      secretKey: 'default-secret-key'
    };
    
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: 'kxyatxy116@163.com',
        pass: 'MCGPa6nsWUCy8dGR'
      }
    });
    
    // 邮件主题
    const subject = isTest 
      ? '【测试】管理员凭证信息' 
      : '【定期通知】管理员登录凭证信息';
    
    // 发送邮件
    await transporter.sendMail({
      from: 'kxyatxy116@163.com',
      to: 'kxyatxy116@163.com',
      subject,
      html: `
        <h2>管理员登录凭证信息</h2>
        <p>以下是您的管理员登录凭证，请妥善保管：</p>
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">项目</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">值</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">访问地址</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${adminCredentials.accessUrl}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 8px;">初始访问密码</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${adminCredentials.initialPassword}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">管理员账号</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${adminCredentials.username}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 8px;">管理员密码</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${adminCredentials.password}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">管理员秘钥</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${adminCredentials.secretKey}</td>
          </tr>
        </table>
        <p><strong>重要提示：</strong>请妥善保管这些凭证，不要泄露给他人。</p>
        <p>此邮件由系统自动发送，请勿回复。</p>
        <hr>
        <p>发送时间：${new Date().toLocaleString('zh-CN')}</p>
        ${isTest ? '<p><strong>测试邮件：</strong>这是一封测试邮件，用于验证邮件系统功能。</p>' : ''}
      `
    });
    
    return NextResponse.json({ 
      success: true, 
      message: isTest ? '测试邮件发送成功' : '管理员凭证邮件发送成功' 
    });
  } catch (error) {
    console.error('发送邮件失败:', error);
    return NextResponse.json({ error: '发送邮件失败' }, { status: 500 });
  }
}
