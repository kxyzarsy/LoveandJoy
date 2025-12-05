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

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  let connection;
  try {
    connection = await createConnection();
    console.log('单篇文章接口 - 数据库连接成功！');
    const [rows] = await connection.execute('SELECT * FROM posts WHERE id = ?', [id]);
    await connection.end();
    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: '文章不存在' }), { status: 404 });
    }
    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('获取单篇文章失败:', error);
    if (connection) await connection.end().catch(err => console.error('关闭连接失败:', err));
    return new Response(JSON.stringify({ message: '获取文章失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}