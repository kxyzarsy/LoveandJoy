import nodemailer from 'nodemailer';

// 邮件配置 - 根据发件人邮箱选择不同的配置
const emailConfigs = {
  '163.com': {
    service: '163',
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_163_USER || 'your-email@163.com',
      pass: process.env.EMAIL_163_PASS || 'BM5YWbFScfXxEuyD' // 网易邮箱授权码
    }
  },
  'qq.com': {
    service: 'qq',
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_QQ_USER || 'your-email@qq.com',
      pass: process.env.EMAIL_QQ_PASS || 'wxjhixyhgmnechgg' // QQ邮箱授权码
    }
  }
};

// 创建邮件传输器工厂函数
const createTransporter = (fromEmail: string) => {
  const emailDomain = fromEmail.split('@')[1];
  const config = emailConfigs[emailDomain as keyof typeof emailConfigs] || emailConfigs['qq.com'];
  return nodemailer.createTransport(config);
};

// 发送验证码邮件
export const sendVerificationEmail = async (
  to: string,
  code: string,
  subject: string = '注册验证码'
): Promise<{ success: boolean; message: string }> => {
  try {
    // 选择发件人邮箱（根据收件人邮箱选择对应服务商的发件人）
    const toDomain = to.split('@')[1];
    let fromEmail: string;
    let configKey: keyof typeof emailConfigs;
    
    if (toDomain === '163.com' || toDomain === '126.com' || toDomain === 'yeah.net') {
      fromEmail = process.env.EMAIL_163_USER || 'kxyatxy116@163.com';
      configKey = '163.com';
    } else {
      fromEmail = process.env.EMAIL_QQ_USER || '1962941753@qq.com';
      configKey = 'qq.com';
    }
    
    // 获取配置
    const config = emailConfigs[configKey];
    
    if (!config) {
      throw new Error(`未找到${configKey}的邮箱配置`);
    }
    
    // 使用环境变量覆盖配置
    const finalConfig = {
      ...config,
      auth: {
        user: configKey === '163.com' ? process.env.EMAIL_163_USER || config.auth.user : process.env.EMAIL_QQ_USER || config.auth.user,
        pass: configKey === '163.com' ? process.env.EMAIL_163_PASS || config.auth.pass : process.env.EMAIL_QQ_PASS || config.auth.pass
      }
    };
    
    // 验证配置
    if (!finalConfig.auth.user || !finalConfig.auth.pass) {
      throw new Error('邮件配置不完整，请检查环境变量');
    }
    


    // 创建邮件传输器
    const transporter = nodemailer.createTransport(finalConfig);
    
    // 验证连接
    try {
      await transporter.verify();

    } catch (verifyError) {
      console.error('SMTP连接验证失败:', verifyError);
      throw new Error(`SMTP连接验证失败: ${verifyError instanceof Error ? verifyError.message : '未知错误'}`);
    }

    // 构建邮件内容
    const mailOptions = {
      from: {
        name: 'Love and Joy Blog',
        address: finalConfig.auth.user
      },
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">注册验证码</h2>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">您好，</p>
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">您正在注册 Love and Joy Blog 账户，您的验证码是：</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 4px;">${code}</span>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">验证码有效期为30分钟，请尽快使用。</p>
            <p style="font-size: 14px; color: #666; margin-top: 10px;">如果您没有请求此验证码，请忽略此邮件。</p>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">© 2024 Love and Joy Blog. All rights reserved.</p>
        </div>
      `
    };

    // 发送邮件
    const info = await transporter.sendMail(mailOptions);

    return { success: true, message: '邮件发送成功' };
  } catch (error) {
    console.error('邮件发送失败:', error);
    
    // 提供更详细的错误信息
    let errorMessage = '邮件发送失败，请稍后重试';
    if (error instanceof Error) {
      if (error.message.includes('authentication failed')) {
        errorMessage = '邮件发送失败：认证失败，请检查邮箱和授权码是否正确';
      } else if (error.message.includes('Invalid login')) {
        errorMessage = '邮件发送失败：登录失败，请检查邮箱和授权码是否正确';
      } else {
        errorMessage = `邮件发送失败：${error.message}`;
      }
    }
    
    return { 
      success: false, 
      message: errorMessage
    };
  }
};

// 验证邮箱格式是否支持
export const isSupportedEmail = (email: string): boolean => {
  const supportedDomains = ['qq.com', '163.com', '126.com', 'yeah.net', 'gmail.com', 'outlook.com', 'hotmail.com', 'sina.com', 'sina.cn', '139.com', '189.cn'];
  const emailDomain = email.split('@')[1]?.toLowerCase();
  return supportedDomains.includes(emailDomain || '');
};
