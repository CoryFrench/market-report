require('dotenv').config();
const { Pool } = require('pg');

console.log('Testing database connection...');
console.log('Host:', process.env.PG_HOST);
console.log('Port:', process.env.PG_PORT);
console.log('User:', process.env.PG_USER);
console.log('Database:', process.env.PG_DATABASE);
console.log('Password:', process.env.PG_PASSWORD ? '[SET]' : '[NOT SET]');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: process.env.PG_SSL ? { rejectUnauthorized: false } : false,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  try {
    console.log('\n🔍 Testing basic connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    console.log('\n🔍 Testing basic query...');
    const result = await client.query('SELECT 1 as test');
    console.log('✅ Query successful:', result.rows);
    
    console.log('\n🔍 Testing MLS schema access...');
    const schemaResult = await client.query(`
      SELECT schemaname, tablename 
      FROM pg_tables 
      WHERE schemaname = 'mls' 
      LIMIT 5
    `);
    console.log('✅ MLS Schema tables:', schemaResult.rows);
    
    console.log('\n🔍 Testing beaches_residential table...');
    const tableResult = await client.query(`
      SELECT COUNT(*) as total_records 
      FROM mls.beaches_residential
    `);
    console.log('✅ Beaches Residential table:', tableResult.rows);
    
    client.release();
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      severity: error.severity,
      detail: error.detail,
      hint: error.hint
    });
  } finally {
    await pool.end();
  }
}

testConnection(); 