require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

async function testPriceChanges() {
  try {
    console.log('Testing price change data...');
    
    // Test price changes query
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
        city,
        status,
        list_price,
        prior_list_price,
        price_change_timestamp,
        prior_list_price as previousPrice,
        list_price as currentPrice
      FROM latest_listings 
      WHERE rn = 1 
        AND status = 'Active'
        AND price_change_timestamp IS NOT NULL
        AND price_change_timestamp != ''
        AND prior_list_price IS NOT NULL 
        AND prior_list_price != ''
        AND prior_list_price != list_price
      ORDER BY price_change_timestamp DESC
      LIMIT 5
    `;
    
    const result = await pool.query(query);
    console.log('✅ Price change results:');
    console.log('Found', result.rows.length, 'price changes');
    
    result.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. ${row.street_number} ${row.street_name}`);
      console.log(`   City: ${row.city}`);
      console.log(`   Status: ${row.status}`);
      console.log(`   Current Price: ${row.list_price}`);
      console.log(`   Previous Price: ${row.prior_list_price}`);
      console.log(`   previousPrice (alias): ${row.previousprice}`);
      console.log(`   currentPrice (alias): ${row.currentprice}`);
      console.log(`   Price Change Date: ${row.price_change_timestamp}`);
    });
    
  } catch (error) {
    console.error('❌ Price change test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testPriceChanges(); 