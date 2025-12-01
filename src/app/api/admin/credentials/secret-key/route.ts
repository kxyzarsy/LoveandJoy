import { NextResponse } from 'next/server';
import { validateSecret, getCurrentSecret } from '../../../../admin-secret';

// 模拟日志记录函数
const logOperation = (action: string, userId: string | null, ipAddress: string, success: boolean, details?: string) => {

};

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { currentKey, newKey } = body;
    
    // 获取客户端IP地址
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';
    
    // 验证当前密钥
    const isValid = await validateSecret(currentKey);
    if (!isValid) {
      logOperation('Update Admin Secret', null, ipAddress, false, 'Invalid current secret key');
      return NextResponse.json({ error: '当前密钥验证失败' }, { status: 401 });
    }
    
    // 验证新密钥复杂度
    if (newKey.length < 16) {
      logOperation('Update Admin Secret', null, ipAddress, false, 'New secret too short');
      return NextResponse.json({ error: '密钥长度至少为16个字符' }, { status: 400 });
    }
    
    if (!/[A-Z]/.test(newKey)) {
      logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing uppercase letter');
      return NextResponse.json({ error: '密钥必须包含至少一个大写字母' }, { status: 400 });
    }
    
    if (!/[a-z]/.test(newKey)) {
      logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing lowercase letter');
      return NextResponse.json({ error: '密钥必须包含至少一个小写字母' }, { status: 400 });
    }
    
    if (!/[0-9]/.test(newKey)) {
      logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing number');
      return NextResponse.json({ error: '密钥必须包含至少一个数字' }, { status: 400 });
    }
    
    if (!/[^A-Za-z0-9]/.test(newKey)) {
      logOperation('Update Admin Secret', null, ipAddress, false, 'New secret missing special character');
      return NextResponse.json({ error: '密钥必须包含至少一个特殊字符' }, { status: 400 });
    }
    
    // 这里应该是更新数据库中的密钥，目前使用环境变量模拟

    
    // 记录操作日志
    logOperation('Update Admin Secret', null, ipAddress, true, 'Secret key updated successfully');
    
    // 发送密钥更新通知邮件
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: 'kxyatxy116@163.com',
          subject: '【重要】管理员密钥已更新',
          html: `
            <h2>管理员密钥更新通知</h2>
            <p>您的管理员密钥已成功更新，新密钥如下：</p>
            <p style="font-size: 18px; font-weight: bold; color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${newKey}</p>
            <p>请妥善保管此密钥，切勿泄露给他人。</p>
            <hr>
            <p>此邮件由系统自动发送，请勿回复。</p>
          `
        })
      });
    } catch (emailError) {
      console.error('发送密钥更新邮件失败:', emailError);
    }
    
    return NextResponse.json({ success: true, message: '管理员密钥更新成功' });
  } catch (error) {
    console.error('更新管理员密钥失败:', error);
    return NextResponse.json({ error: '更新失败，请稍后重试' }, { status: 500 });
  }
}