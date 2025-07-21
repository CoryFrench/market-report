-- Performance Indexes for Market Report Area-Profile Queries
-- Generated based on analysis of database.js query patterns

-- =============================================================================
-- PRIMARY PERFORMANCE INDEXES FOR AREA-PROFILE QUERIES
-- =============================================================================

-- 1. CRITICAL: Composite index for the window function partitioning and ordering
-- This supports the ROW_NUMBER() OVER (PARTITION BY listing_id ORDER BY timestamp DESC) pattern
-- used in ALL queries to get the latest record per listing_id
CREATE INDEX CONCURRENTLY idx_beaches_residential_listing_timestamp_desc 
ON mls.beaches_residential (listing_id, timestamp DESC) 
WHERE listing_id IS NOT NULL;

-- 2. CRITICAL: Status-based filtering with key date columns
-- Supports all status-based queries with their corresponding date sorts
CREATE INDEX CONCURRENTLY idx_beaches_residential_status_dates 
ON mls.beaches_residential (status, listing_date DESC, sold_date DESC, under_contract_date DESC, price_change_timestamp DESC) 
WHERE listing_id IS NOT NULL;

-- 3. CRITICAL: Price filtering support for numeric conversions
-- Supports price range filtering on list_price (most common)
CREATE INDEX CONCURRENTLY idx_beaches_residential_list_price_numeric 
ON mls.beaches_residential (status, (list_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND list_price IS NOT NULL 
  AND list_price != '';

-- 4. CRITICAL: Price filtering for sold properties
-- Supports price range filtering on sold_price for sales queries
CREATE INDEX CONCURRENTLY idx_beaches_residential_sold_price_numeric 
ON mls.beaches_residential (status, (sold_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND sold_price IS NOT NULL 
  AND sold_price != ''
  AND status = 'Closed';

-- =============================================================================
-- SPECIFIC QUERY OPTIMIZATION INDEXES
-- =============================================================================

-- 5. Active Listings Optimization
-- Optimizes: getActiveListingsForArea() and getActiveListings()
CREATE INDEX CONCURRENTLY idx_beaches_residential_active_listings 
ON mls.beaches_residential (status, city, (list_price::numeric), listing_date DESC) 
WHERE listing_id IS NOT NULL 
  AND status = 'Active' 
  AND list_price IS NOT NULL 
  AND list_price != '';

-- 6. Recent Sales Optimization (30-day window)
-- Optimizes: getRecentSalesForArea() and getRecentSales()
CREATE INDEX CONCURRENTLY idx_beaches_residential_recent_sales 
ON mls.beaches_residential (status, city, (sold_date::date), (sold_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND status = 'Closed' 
  AND sold_date IS NOT NULL 
  AND sold_date != '';

-- 7. Under Contract Properties Optimization
-- Optimizes: getUnderContractForArea() and getUnderContract()
CREATE INDEX CONCURRENTLY idx_beaches_residential_under_contract 
ON mls.beaches_residential (status, city, (under_contract_date::date), (list_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND status IN ('Active Under Contract', 'Pending');

-- 8. Coming Soon Properties Optimization
-- Optimizes: getComingSoonForArea() and getComingSoon()
CREATE INDEX CONCURRENTLY idx_beaches_residential_coming_soon 
ON mls.beaches_residential (status, city, (listing_date::date), (list_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND status = 'Coming Soon';

-- 9. Price Changes Optimization (30-day window)
-- Optimizes: getPriceChangesForArea() and getPriceChanges()
CREATE INDEX CONCURRENTLY idx_beaches_residential_price_changes 
ON mls.beaches_residential (status, (price_change_timestamp::timestamp), city, (list_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND status = 'Active' 
  AND price_change_timestamp IS NOT NULL 
  AND price_change_timestamp != ''
  AND prior_list_price IS NOT NULL 
  AND prior_list_price != ''
  AND prior_list_price != list_price;

-- =============================================================================
-- JOIN OPTIMIZATION INDEXES
-- =============================================================================

-- 10. MLS Table Parcel ID Index for Development Data JOINs
-- Supports JOIN with waterfrontdata.development_data on parcel matching
CREATE INDEX CONCURRENTLY idx_beaches_residential_parcel_join 
ON mls.beaches_residential (parcel_id, listing_id, timestamp DESC) 
WHERE listing_id IS NOT NULL 
  AND parcel_id IS NOT NULL 
  AND parcel_id != '';

-- 11. Address-based JOIN fallback optimization
-- Supports address matching when parcel matching fails
CREATE INDEX CONCURRENTLY idx_beaches_residential_address_join 
ON mls.beaches_residential (UPPER(TRIM(street_number || ' ' || street_name)), listing_id, timestamp DESC) 
WHERE listing_id IS NOT NULL 
  AND street_number IS NOT NULL 
  AND street_name IS NOT NULL;

-- 12. Development Data Table Optimization (if you control this table)
-- Optimizes the JOIN from the development_data side
CREATE INDEX CONCURRENTLY idx_development_data_join_keys 
ON waterfrontdata.development_data (parcel_number, UPPER(TRIM(property_address_line_1)), development_name, subdivision_name, zone_name);

-- =============================================================================
-- MARKET STATISTICS OPTIMIZATION INDEXES
-- =============================================================================

-- 13. Market Stats All-Status Index
-- Supports getMarketStatsForArea() complex aggregation queries
CREATE INDEX CONCURRENTLY idx_beaches_residential_market_stats 
ON mls.beaches_residential (
  city, 
  status, 
  (listing_date::date), 
  (sold_date::date), 
  (under_contract_date::date),
  (price_change_timestamp::timestamp),
  (list_price::numeric),
  (sold_price::numeric)
) 
WHERE listing_id IS NOT NULL;

-- 14. Waterfront Properties Index
-- Supports area profiles with waterfront filtering
CREATE INDEX CONCURRENTLY idx_beaches_residential_waterfront 
ON mls.beaches_residential (waterfront, status, city, (list_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND waterfront = 'Yes';

-- =============================================================================
-- MAINTENANCE AND MONITORING
-- =============================================================================

-- 15. General Property Search Index
-- Supports searchProperties() method with multiple filters
CREATE INDEX CONCURRENTLY idx_beaches_residential_property_search 
ON mls.beaches_residential (
  status, 
  city, 
  (total_bedrooms::integer), 
  (baths_total::numeric), 
  private_pool, 
  waterfront, 
  (list_price::numeric),
  (listing_date::date)
) 
WHERE listing_id IS NOT NULL;

-- =============================================================================
-- INDEX USAGE MONITORING QUERIES
-- =============================================================================

-- Monitor index usage with these queries:
/*
-- Check index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes 
WHERE tablename = 'beaches_residential'
ORDER BY idx_scan DESC;

-- Check index sizes
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes 
WHERE tablename = 'beaches_residential'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Find unused indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes 
WHERE tablename = 'beaches_residential' 
  AND idx_scan = 0;
*/

-- =============================================================================
-- NOTES ON IMPLEMENTATION
-- =============================================================================

/*
IMPLEMENTATION NOTES:

1. Use CONCURRENTLY option to avoid locking the table during index creation
2. Indexes are created with WHERE clauses to reduce size and improve performance
3. Functional indexes on type casts (::numeric, ::date, ::timestamp) support the 
   safe casting pattern used in the database service
4. Composite indexes are ordered by selectivity (most selective columns first)
5. Consider running VACUUM ANALYZE after creating all indexes
6. Monitor index usage and drop unused indexes to maintain performance

ESTIMATED IMPACT:
- Window function queries: 70-90% faster (indexes 1, 10, 11)
- Status-based filtering: 80-95% faster (indexes 2, 5, 6, 7, 8, 9)
- Price range queries: 60-85% faster (indexes 3, 4)
- Complex JOINs: 50-80% faster (indexes 10, 11, 12)
- Market statistics: 60-90% faster (index 13)

MAINTENANCE:
- Re-run statistics after bulk data loads: ANALYZE mls.beaches_residential;
- Monitor index bloat and rebuild if needed
- Consider partitioning if the table grows beyond 10M rows
*/ 