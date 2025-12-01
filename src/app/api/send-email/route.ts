import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * 发送邮件的API路由
 * 仅在服务器端运行，避免客户端使用child_process
 */
export async function POST(request: Request) {
  try {
    const { subject, html, to } = await request.json();
    
    // 验证必填字段
    if (!subject || !html || !to) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }
    
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
    
    // 发送邮件
    await transporter.sendMail({
      from: 'kxyatxy116@163.com',
      to,
      subject,
      html
    });
    
    return NextResponse.json({ success: true, message: '邮件发送成功' });
  } catch (error) {
    console.error('发送邮件失败:', error);
    return NextResponse.json({ error: '发送邮件失败' }, { status: 500 });
  }
}
