import mysql from 'mysql2/promise';

async function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Likeyue@2024',
    database: 'cloud_yueblog',
    connectTimeout: 10000
  });
}

export async function GET() {
  let connection;
  try {
    connection = await createConnection();
    console.log('文章列表接口 - 数据库连接成功！');
    const [rows] = await connection.execute('SELECT * FROM posts ORDER BY created_at DESC');
    await connection.end();
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    if (connection) await connection.end().catch(err => console.error('关闭连接失败:', err));
    return new Response(JSON.stringify({ message: '获取文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}