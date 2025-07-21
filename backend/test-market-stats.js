require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Helper function to safely cast text dates to dates
function castDate(fieldName) {
  return `CASE WHEN ${fieldName} IS NOT NULL AND ${fieldName} != '' THEN ${fieldName}::date ELSE NULL END`;
}

async function testMarketStats() {
  try {
    console.log('Testing market stats query...');
    
    const query = `
      SELECT 
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_listings,
        COUNT(CASE WHEN status = 'Closed' AND ${castDate('sold_date')} >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as sales_last_30_days,
        COUNT(CASE WHEN status IN ('Active Under Contract', 'Pending') THEN 1 END) as under_contract,
        COUNT(CASE WHEN status = 'Coming Soon' THEN 1 END) as coming_soon,
        AVG(CASE WHEN status = 'Active' AND days_on_market IS NOT NULL AND days_on_market != '' AND days_on_market::integer > 0 THEN days_on_market::integer END) as avg_days_on_market,
        AVG(CASE WHEN status = 'Closed' AND ${castDate('sold_date')} >= CURRENT_DATE - INTERVAL '30 days' AND sold_price IS NOT NULL AND sold_price != '' THEN sold_price::numeric END) as avg_sold_price,
        AVG(CASE WHEN status = 'Active' AND list_price IS NOT NULL AND list_price != '' THEN list_price::numeric END) as avg_list_price,
        MIN(CASE WHEN status = 'Active' AND list_price IS NOT NULL AND list_price != '' THEN list_price::numeric END) as min_list_price,
        MAX(CASE WHEN status = 'Active' AND list_price IS NOT NULL AND list_price != '' THEN list_price::numeric END) as max_list_price
      FROM mls.beaches_residential 
      WHERE city = 'Jupiter'
    `;
    
    console.log('Query:', query);
    
    const result = await pool.query(query);
    console.log('✅ Market stats query successful:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Market stats query failed:', error.message);
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

testMarketStats(); 