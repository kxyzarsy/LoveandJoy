import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/emailService';

// 内存存储验证码，生产环境建议使用Redis
const verificationCodes = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// 发送验证码
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 验证邮箱格式
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 检查发送频率
    const existingCode = verificationCodes.get(email);
    const now = Date.now();
    const cooldownPeriod = 60 * 1000; // 60秒冷却期
    const maxAttempts = 5; // 每小时最大尝试次数
    const attemptsResetPeriod = 60 * 60 * 1000; // 1小时重置尝试次数

    if (existingCode) {
      // 检查冷却期
      if (now - (existingCode.expiresAt - 30 * 60 * 1000) < cooldownPeriod) {
        return NextResponse.json(
          { success: false, message: '发送过于频繁，请稍后再试' },
          { status: 429 }
        );
      }

      // 检查尝试次数
      if (existingCode.attempts >= maxAttempts && now - (existingCode.expiresAt - 30 * 60 * 1000) < attemptsResetPeriod) {
        return NextResponse.json(
          { success: false, message: '验证码发送次数过多，请1小时后再试' },
          { status: 429 }
        );
      }
    }

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 30 * 60 * 1000; // 30分钟后过期

    // 发送邮件
    const emailResult = await sendVerificationEmail(email, code);
    
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: emailResult.message },
        { status: 500 }
      );
    }

    // 存储验证码信息
    verificationCodes.set(email, {
      code,
      expiresAt,
      attempts: existingCode ? existingCode.attempts + 1 : 1
    });

    // 30分钟后自动删除过期验证码
    setTimeout(() => {
      verificationCodes.delete(email);
    }, 30 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: '验证码已发送到您的邮箱，请查收',
      cooldown: cooldownPeriod
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    return NextResponse.json(
      { success: false, message: '发送验证码失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 验证验证码
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const code = url.searchParams.get('code');

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    const existingCode = verificationCodes.get(email);
    const now = Date.now();

    if (!existingCode) {
      return NextResponse.json(
        { success: false, message: '验证码不存在或已过期' },
        { status: 400 }
      );
    }

    if (now > existingCode.expiresAt) {
      verificationCodes.delete(email);
      return NextResponse.json(
        { success: false, message: '验证码已过期，请重新获取' },
        { status: 400 }
      );
    }

    if (existingCode.code !== code) {
      return NextResponse.json(
        { success: false, message: '验证码错误' },
        { status: 400 }
      );
    }

    // 验证码验证成功，移除验证码
    verificationCodes.delete(email);

    return NextResponse.json({
      success: true,
      message: '验证码验证成功'
    });
  } catch (error) {
    console.error('验证验证码失败:', error);
    return NextResponse.json(
      { success: false, message: '验证验证码失败，请稍后重试' },
      { status: 500 }
    );
  }
}
