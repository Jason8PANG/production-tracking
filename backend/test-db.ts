import mysql from 'mysql2/promise';

async function test() {
  console.log('🔍 查询 site_station 表...\n');
  
  const pool = mysql.createPool({
    host: '10.0.6.86',
    port: 33306,
    user: 'root',
    password: 'root07',
    database: 'wiptrack'
  });

  try {
    const [sites] = await pool.query('SELECT DISTINCT SiteRef FROM site_station');
    console.log('✅ Sites:', sites);

    const [stations] = await pool.query("SELECT DISTINCT Station FROM site_station WHERE SiteRef='Suzhou P1'");
    console.log('✅ Stations for Suzhou P1:', stations);
    
    await pool.end();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

test();
