import mysql from 'mysql2/promise';

// 数据库连接配置
const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'yueblog',
  // 连接池配置
  connectionLimit: 10, // 最大连接数
  queueLimit: 0, // 连接请求队列大小，0表示无限制
  waitForConnections: true, // 当连接池无可用连接时，是否等待
  connectTimeout: 10000, // 建立连接的超时时间（毫秒）
  idleTimeout: 60000, // 连接空闲超时时间（毫秒）
  enableKeepAlive: true, // 启用TCP KeepAlive
  keepAliveInitialDelay: 30000 // TCP KeepAlive初始延迟（毫秒）
};

// 创建数据库连接池
const pool = mysql.createPool(DB_CONFIG);

/**
 * 获取数据库连接
 * @returns Promise<mysql.PoolConnection> 数据库连接对象
 */
export const getConnection = async (): Promise<mysql.PoolConnection> => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('获取数据库连接失败:', error);
    throw error;
  }
};

/**
 * 释放数据库连接
 * @param connection 数据库连接对象
 */
export const releaseConnection = (connection: mysql.PoolConnection): void => {
  try {
    connection.release();
  } catch (error) {
    console.error('释放数据库连接失败:', error);
  }
};

/**
 * 执行SQL查询（自动管理连接）
 * @param sql SQL查询语句
 * @param values 查询参数
 * @returns Promise<[mysql.QueryResult, mysql.FieldPacket[]]> 查询结果
 */
export const executeQuery = async (sql: string, values?: unknown[]): Promise<[mysql.QueryResult, mysql.FieldPacket[]]> => {
  let connection: mysql.PoolConnection | null = null;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, values);
    return result;
  } catch (error) {
    console.error('执行SQL查询失败:', error);
    throw error;
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * 执行事务操作
 * @param callback 事务回调函数，接收connection参数，返回Promise
 * @returns Promise<T> 事务执行结果
 */
export const executeTransaction = async <T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> => {
  let connection: mysql.PoolConnection | null = null;
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('执行事务失败:', error);
    throw error;
  } finally {
    if (connection) {
      releaseConnection(connection);
    }
  }
};

/**
 * 获取连接池状态
 * @returns Promise<{ size: number, used: number, free: number, pending: number }> 连接池状态
 */
export const getPoolStatus = async (): Promise<{ size: number; used: number; free: number; pending: number }> => {
  try {
    // 由于mysql2连接池的私有属性无法直接访问，我们返回配置的连接参数
    return {
      size: DB_CONFIG.connectionLimit,
      used: 0, // 无法直接获取，返回0
      free: DB_CONFIG.connectionLimit, // 无法直接获取，返回配置的连接数
      pending: 0 // 无法直接获取，返回0
    };
  } catch (error) {
    console.error('获取连接池状态失败:', error);
    return {
      size: 0,
      used: 0,
      free: 0,
      pending: 0
    };
  }
};

/**
 * 关闭连接池
 */
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('数据库连接池已关闭');
  } catch (error) {
    console.error('关闭连接池失败:', error);
    throw error;
  }
};

// 导出连接池，方便直接使用
export default pool;
