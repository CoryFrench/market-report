require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

async function testSimpleQuery() {
  try {
    console.log('Testing simple query...');
    
    // Test basic connection
    const result = await pool.query('SELECT COUNT(*) as total FROM mls.beaches_residential LIMIT 1');
    console.log('✅ Basic query successful:', result.rows[0]);
    
    // Test with Jupiter city filter
    const jupiterResult = await pool.query(`
      SELECT COUNT(*) as total 
      FROM mls.beaches_residential 
      WHERE city = 'Jupiter'
    `);
    console.log('✅ Jupiter query successful:', jupiterResult.rows[0]);
    
    // Test active listings
    const activeResult = await pool.query(`
      SELECT COUNT(*) as total 
      FROM mls.beaches_residential 
      WHERE status = 'Active' AND city = 'Jupiter'
    `);
    console.log('✅ Active listings query successful:', activeResult.rows[0]);
    
    console.log('\n🎉 All simple queries passed!');
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testSimpleQuery(); 