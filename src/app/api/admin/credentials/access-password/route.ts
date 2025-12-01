import { NextResponse } from 'next/server';

// 模拟日志记录函数
const logOperation = (action: string, userId: string | null, ipAddress: string, success: boolean, details?: string) => {

};

// 模拟获取当前初始访问密码
const getCurrentAccessPassword = async (): Promise<string> => {
  // 这里使用环境变量作为临时解决方案，后续将替换为数据库查询
  return process.env.INITIAL_ACCESS_PASSWORD || 'default-access-password';
};

// 模拟验证初始访问密码
const validateAccessPassword = async (password: string): Promise<boolean> => {
  const currentPassword = await getCurrentAccessPassword();
  return password === currentPassword;
};

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    // 获取客户端IP地址
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';
    
    // 验证当前密码
    const isValid = await validateAccessPassword(currentPassword);
    if (!isValid) {
      logOperation('Update Initial Access Password', null, ipAddress, false, 'Invalid current access password');
      return NextResponse.json({ error: '当前密码验证失败' }, { status: 401 });
    }
    
    // 验证新密码复杂度
    if (newPassword.length < 8) {
      logOperation('Update Initial Access Password', null, ipAddress, false, 'New password too short');
      return NextResponse.json({ error: '密码长度至少为8个字符' }, { status: 400 });
    }
    
    if (!/[A-Z]/.test(newPassword)) {
      logOperation('Update Initial Access Password', null, ipAddress, false, 'New password missing uppercase letter');
      return NextResponse.json({ error: '密码必须包含至少一个大写字母' }, { status: 400 });
    }
    
    if (!/[a-z]/.test(newPassword)) {
      logOperation('Update Initial Access Password', null, ipAddress, false, 'New password missing lowercase letter');
      return NextResponse.json({ error: '密码必须包含至少一个小写字母' }, { status: 400 });
    }
    
    if (!/[0-9]/.test(newPassword)) {
      logOperation('Update Initial Access Password', null, ipAddress, false, 'New password missing number');
      return NextResponse.json({ error: '密码必须包含至少一个数字' }, { status: 400 });
    }
    
    // 这里应该是更新数据库中的初始访问密码，目前使用环境变量模拟

    
    // 记录操作日志
    logOperation('Update Initial Access Password', null, ipAddress, true, 'Access password updated successfully');
    
    // 发送密码更新通知邮件
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: 'kxyatxy116@163.com',
          subject: '【重要】初始访问密码已更新',
          html: `
            <h2>初始访问密码更新通知</h2>
            <p>管理员登录入口的初始访问密码已成功更新，新密码如下：</p>
            <p style="font-size: 18px; font-weight: bold; color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${newPassword}</p>
            <p>请妥善保管此密码，切勿泄露给他人。</p>
            <hr>
            <p>此邮件由系统自动发送，请勿回复。</p>
          `
        })
      });
    } catch (emailError) {
      console.error('发送初始访问密码更新邮件失败:', emailError);
    }
    
    return NextResponse.json({ success: true, message: '初始访问密码更新成功' });
  } catch (error) {
    console.error('更新初始访问密码失败:', error);
    return NextResponse.json({ error: '更新失败，请稍后重试' }, { status: 500 });
  }
}