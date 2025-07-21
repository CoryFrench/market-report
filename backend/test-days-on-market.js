require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

async function testDaysOnMarket() {
  try {
    console.log('Testing days on market calculation...');
    
    // Test days on market calculation
    const query = `
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
        listing_id,
        street_number,
        street_name,
        status,
        listing_date,
        sold_date,
        under_contract_date,
        days_on_market,
        CASE 
          WHEN status = 'Closed' AND sold_date IS NOT NULL AND sold_date != '' AND listing_date IS NOT NULL AND listing_date != ''
          THEN sold_date::date - listing_date::date
          WHEN status IN ('Active Under Contract', 'Pending') AND under_contract_date IS NOT NULL AND under_contract_date != '' AND listing_date IS NOT NULL AND listing_date != ''
          THEN under_contract_date::date - listing_date::date
          WHEN status = 'Active' AND listing_date IS NOT NULL AND listing_date != ''
          THEN CURRENT_DATE - listing_date::date
          ELSE NULL
        END as calculated_days_on_market
      FROM latest_listings 
      WHERE rn = 1
        AND city = 'Jupiter'
        AND status IN ('Active', 'Closed', 'Active Under Contract', 'Pending')
        AND listing_date IS NOT NULL 
        AND listing_date != ''
      ORDER BY listing_date DESC
      LIMIT 10
    `;
    
    const result = await pool.query(query);
    console.log('✅ Days on market comparison:');
    console.log('Found', result.rows.length, 'listings');
    
    result.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. ${row.street_number} ${row.street_name}`);
      console.log(`   Status: ${row.status}`);
      console.log(`   Listing Date: ${row.listing_date}`);
      console.log(`   Sold Date: ${row.sold_date}`);
      console.log(`   Under Contract Date: ${row.under_contract_date}`);
      console.log(`   DB Days on Market: ${row.days_on_market}`);
      console.log(`   Calculated Days on Market: ${row.calculated_days_on_market}`);
      
      const dbValue = parseInt(row.days_on_market) || 0;
      const calculatedValue = parseInt(row.calculated_days_on_market) || 0;
      const difference = Math.abs(dbValue - calculatedValue);
      
      if (difference > 5) {
        console.log(`   ⚠️  SIGNIFICANT DIFFERENCE: ${difference} days`);
      }
    });
    
  } catch (error) {
    console.error('❌ Days on market test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testDaysOnMarket(); 