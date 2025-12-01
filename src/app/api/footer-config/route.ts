import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// 定义页脚配置类型
interface FooterConfig {
  id?: number;
  site_title: string;
  site_description: string;
  email: string;
  phone: string;
  address: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  social_github: string;
  social_linkedin: string;
  quick_links: any[];
  background_color: string;
  text_color: string;
  link_color: string;
  link_hover_color: string;
  border_color: string;
  font_size: string;
  layout_columns: number;
  show_social_media: boolean;
  show_contact_info: boolean;
  show_quick_links: boolean;
  show_copyright: boolean;
  copyright_text: string;
  created_at?: Date;
  updated_at?: Date;
}

// 定义数据库执行结果类型
interface InsertResult {
  insertId: number;
}

// 创建数据库连接
async function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'yueblog'
  });
}

// 获取页尾配置
export async function GET() {
  try {
    const connection = await createConnection();
// 查询页脚配置
    const [rows] = await connection.execute('SELECT * FROM footer_config ORDER BY id DESC LIMIT 1');
    await connection.end();
    
    let config = (rows as any[])[0];
    
    // 确保所有字符串字段不为null，转换为空字符串
    if (config) {
      config = {
        ...config,
        site_title: config.site_title || '',
        site_description: config.site_description || '',
        email: config.email || '',
        phone: config.phone || '',
        address: config.address || '',
        social_facebook: config.social_facebook || '',
        social_twitter: config.social_twitter || '',
        social_instagram: config.social_instagram || '',
        social_github: config.social_github || '',
        social_linkedin: config.social_linkedin || '',
        copyright_text: config.copyright_text || ''
      };
    }
    
    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('获取页尾配置失败:', error);
    return NextResponse.json({ error: '获取页尾配置失败' }, { status: 500 });
  }
}

// 更新页尾配置
export async function PUT(request: Request) {
  try {
    const body: FooterConfig = await request.json();
    const connection = await createConnection();
    
    // 检查是否存在配置
    const [existingConfigs] = await connection.execute(
      'SELECT id FROM footer_config ORDER BY id DESC LIMIT 1'
    );
    
    if ((existingConfigs as any[]).length > 0) {
      // 更新现有配置
      const configId = (existingConfigs as any[])[0].id;
      await connection.execute(
        `UPDATE footer_config SET 
          site_title = ?, site_description = ?, email = ?, phone = ?, address = ?, 
          social_facebook = ?, social_twitter = ?, social_instagram = ?, social_github = ?, social_linkedin = ?, 
          quick_links = ?, 
          background_color = ?, text_color = ?, link_color = ?, link_hover_color = ?, border_color = ?, font_size = ?, 
          layout_columns = ?, show_social_media = ?, show_contact_info = ?, show_quick_links = ?, show_copyright = ?, 
          copyright_text = ? 
        WHERE id = ?`,
        [
          body.site_title,
          body.site_description,
          body.email,
          body.phone,
          body.address,
          body.social_facebook,
          body.social_twitter,
          body.social_instagram,
          body.social_github,
          body.social_linkedin,
          JSON.stringify(body.quick_links),
          body.background_color,
          body.text_color,
          body.link_color,
          body.link_hover_color,
          body.border_color,
          body.font_size,
          body.layout_columns,
          body.show_social_media,
          body.show_contact_info,
          body.show_quick_links,
          body.show_copyright,
          body.copyright_text,
          configId
        ]
      );
      
      // 获取更新后的配置
      const [updatedConfigs] = await connection.execute(
        'SELECT * FROM footer_config WHERE id = ?',
        [configId]
      );
      await connection.end();
      
      return NextResponse.json((updatedConfigs as any[])[0], { status: 200 });
    } else {
      // 创建新配置
      const [result] = await connection.execute(
        `INSERT INTO footer_config (
          site_title, site_description, email, phone, address, 
          social_facebook, social_twitter, social_instagram, social_github, social_linkedin, 
          quick_links, 
          background_color, text_color, link_color, link_hover_color, border_color, font_size, 
          layout_columns, show_social_media, show_contact_info, show_quick_links, show_copyright, 
          copyright_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.site_title,
          body.site_description,
          body.email,
          body.phone,
          body.address,
          body.social_facebook,
          body.social_twitter,
          body.social_instagram,
          body.social_github,
          body.social_linkedin,
          JSON.stringify(body.quick_links),
          body.background_color,
          body.text_color,
          body.link_color,
          body.link_hover_color,
          body.border_color,
          body.font_size,
          body.layout_columns,
          body.show_social_media,
          body.show_contact_info,
          body.show_quick_links,
          body.show_copyright,
          body.copyright_text
        ]
      );
      
      // 获取新创建的配置
      const [newConfigs] = await connection.execute(
        'SELECT * FROM footer_config WHERE id = ?',
        [(result as any).insertId]
      );
      await connection.end();
      
      return NextResponse.json((newConfigs as any[])[0], { status: 201 });
    }
  } catch (error) {
    console.error('更新页尾配置失败:', error);
    return NextResponse.json({ error: '更新页尾配置失败', details: (error as Error).message }, { status: 500 });
  }
}
