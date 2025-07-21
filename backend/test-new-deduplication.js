require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

async function testDeduplication() {
  try {
    console.log('Testing new deduplication logic...');
    
    // Test the new deduplication approach
    const dedupQuery = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT 
        COUNT(*) as unique_current_listings,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_listings,
        COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed_listings,
        COUNT(CASE WHEN status IN ('Active Under Contract', 'Pending') THEN 1 END) as under_contract_listings,
        COUNT(CASE WHEN status = 'Coming Soon' THEN 1 END) as coming_soon_listings
      FROM latest_listings 
      WHERE rn = 1
    `;
    
    const result = await pool.query(dedupQuery);
    console.log('✅ Deduplication results:', result.rows[0]);
    
    // Test Jupiter area specifically
    const jupiterQuery = `
      WITH latest_listings AS (
        SELECT *,
               ROW_NUMBER() OVER (
                 PARTITION BY listing_id 
                 ORDER BY timestamp DESC
               ) as rn
        FROM mls.beaches_residential
        WHERE listing_id IS NOT NULL
      )
      SELECT 
        COUNT(*) as jupiter_total_listings,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as jupiter_active_listings,
        COUNT(CASE WHEN status = 'Closed' THEN 1 END) as jupiter_closed_listings
      FROM latest_listings 
      WHERE rn = 1 AND city = 'Jupiter'
    `;
    
    const jupiterResult = await pool.query(jupiterQuery);
    console.log('✅ Jupiter area results:', jupiterResult.rows[0]);
    
    console.log('\n🎉 New deduplication logic is working!');
    
  } catch (error) {
    console.error('❌ Deduplication test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testDeduplication(); 