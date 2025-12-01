
/**
 * 管理员秘钥管理系统
 * 用于管理管理员登录秘钥，实现高安全性的管理员认证
 */

/**
 * 管理员秘钥管理系统
 * 用于管理管理员登录秘钥，实现高安全性的管理员认证
 * 注意：当前使用临时解决方案，后续将替换为数据库实现
 */

/**
 * 生成随机秘钥
 * @param length 秘钥长度
 * @returns 随机秘钥
 */
export function generateSecretKey(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 获取当前有效秘钥
 * @returns 有效秘钥或null
 */
export async function getCurrentSecret(): Promise<string | null> {
  try {
    // 这里使用内存存储作为临时解决方案，后续将替换为数据库查询
    const secret = process.env.ADMIN_SECRET || 'default-secret-key';
    return secret;
  } catch (error) {
    console.error('获取当前秘钥失败:', error);
    return null;
  }
}

/**
 * 验证秘钥是否有效
 * @param secretKey 待验证的秘钥
 * @returns 验证结果
 */
export async function validateSecret(secretKey: string): Promise<boolean> {
  try {
    const currentSecret = await getCurrentSecret();
    return secretKey === currentSecret;
  } catch (error) {
    console.error('验证秘钥失败:', error);
    return false;
  }
}

/**
 * 更新管理员秘钥
 * @param updatedBy 更新人ID
 * @returns 更新后的秘钥
 */
export async function updateAdminSecret(updatedBy: number | null): Promise<string> {
  try {
    const newSecret = generateSecretKey();
    
    // 这里使用环境变量作为临时解决方案，后续将替换为数据库更新

    
    // 发送秘钥更新通知邮件
    await sendSecretUpdateEmail(newSecret);
    
    return newSecret;
  } catch (error) {
    console.error('更新管理员秘钥失败:', error);
    throw error;
  }
}

/**
 * 发送秘钥更新邮件
 * @param newSecret 新秘钥
 */
export async function sendSecretUpdateEmail(newSecret: string): Promise<void> {
  try {
    const emailData = {
      to: 'kxyatxy116@163.com',
      subject: '【重要】管理员秘钥已更新',
      html: `
        <h2>管理员秘钥更新通知</h2>
        <p>您的管理员秘钥已成功更新，新秘钥如下：</p>
        <p style="font-size: 18px; font-weight: bold; color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${newSecret}</p>
        <p>请妥善保管此秘钥，切勿泄露给他人。</p>
        <p>秘钥有效期：7天</p>
        <p>系统将在秘钥过期前24小时再次提醒您更新。</p>
        <hr>
        <p>此邮件由系统自动发送，请勿回复。</p>
      `
    };
    
    // 调用服务器端API发送邮件
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    if (response.ok) {

    } else {
      console.error('发送秘钥更新邮件失败:', await response.json());
    }
  } catch (error) {
    console.error('发送秘钥更新邮件失败:', error);
  }
}

/**
 * 记录登录日志
 * @param data 登录日志数据
 */
export async function logLoginAttempt(data: {
  userId?: number;
  username: string;
  ipAddress: string;
  userAgent: string;
  isSuccess: boolean;
  errorMessage?: string;
}): Promise<void> {
  try {
    // 这里使用控制台日志作为临时解决方案，后续将替换为数据库插入

  } catch (error) {
    console.error('记录登录日志失败:', error);
  }
}

/**
 * 检查秘钥是否需要更新
 * @returns 是否需要更新
 */
export async function checkSecretUpdateNeeded(): Promise<boolean> {
  try {
    // 这里使用固定逻辑作为临时解决方案，后续将替换为数据库查询
    // 实际实现中应检查秘钥创建时间，判断是否需要更新
    return false;
  } catch (error) {
    console.error('检查秘钥更新需求失败:', error);
    return false;
  }
}

/**
 * 初始化管理员秘钥
 */
export async function initializeAdminSecret(): Promise<void> {
  try {
    // 检查是否已有秘钥
    const currentSecret = await getCurrentSecret();
    if (!currentSecret || currentSecret === 'default-secret-key') {
      // 生成新秘钥
      const newSecret = generateSecretKey();

      await sendSecretUpdateEmail(newSecret);
    }
  } catch (error) {
    console.error('初始化管理员秘钥失败:', error);
  }
}
