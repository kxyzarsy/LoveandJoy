-- 创建页尾配置表
CREATE TABLE footer_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- 基本信息
  site_title VARCHAR(255) NOT NULL DEFAULT '我的博客',
  site_description TEXT,
  
  -- 联系方式
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  
  -- 社交媒体链接
  social_facebook VARCHAR(255),
  social_twitter VARCHAR(255),
  social_instagram VARCHAR(255),
  social_github VARCHAR(255),
  social_linkedin VARCHAR(255),
  
  -- 快捷链接
  quick_links JSON,
  
  -- 样式配置
  background_color VARCHAR(20) DEFAULT '#f0f4f8',
  text_color VARCHAR(20) DEFAULT '#333333',
  link_color VARCHAR(20) DEFAULT '#2563eb',
  link_hover_color VARCHAR(20) DEFAULT '#1d4ed8',
  border_color VARCHAR(20) DEFAULT '#dbeafe',
  font_size VARCHAR(10) DEFAULT '14px',
  
  -- 布局配置
  layout_columns INT DEFAULT 3,
  show_social_media BOOLEAN DEFAULT TRUE,
  show_contact_info BOOLEAN DEFAULT TRUE,
  show_quick_links BOOLEAN DEFAULT TRUE,
  show_copyright BOOLEAN DEFAULT TRUE,
  
  -- 版权信息
  copyright_text TEXT,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认配置
INSERT INTO footer_config (
  site_title, 
  site_description, 
  email, 
  phone, 
  address, 
  social_facebook, 
  social_twitter, 
  social_instagram, 
  quick_links,
  copyright_text
) VALUES (
  '我的博客',
  '分享技术见解、生活感悟和学习心得，记录成长的每一步。',
  'contact@example.com',
  '+86 123 4567 8910',
  '北京市朝阳区某某街道123号',
  '#',
  '#',
  '#',
  '[{"name":"首页","url":"/"},{"name":"全部文章","url":"/all-posts"},{"name":"关于我们","url":"/about"},{"name":"隐私政策","url":"#"},{"name":"使用条款","url":"#"},{"name":"版权声明","url":"#"}]',
  '© {year} 我的博客. 保留所有权利.'
);
