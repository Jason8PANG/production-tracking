import mysql from 'mysql2/promise';

async function main() {
  const pool = mysql.createPool({
    host: '10.0.6.86',
    port: 33306,
    user: 'root',
    password: 'root07',
    database: 'wiptrack'
  });

  console.log('=== site_station 表结构 ===');
  const [rows] = await pool.query('SELECT * FROM site_station ORDER BY SiteRef, id');
  console.log(JSON.stringify(rows, null, 2));

  await pool.end();
}

main();
