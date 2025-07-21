# Market Report Performance Index Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing PostgreSQL indexes to optimize the area-profile page queries. The indexes are designed based on analysis of the `database.js` service and the query patterns used by the area-profile frontend.

## Pre-Implementation Checklist

1. **Backup your database** before implementing any indexes
2. **Check current database size** and available disk space (indexes require additional storage)
3. **Plan maintenance window** if needed (though CONCURRENTLY reduces blocking)
4. **Monitor current query performance** to establish baseline metrics

```sql
-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('mls.beaches_residential')) AS total_size;

-- Check current slow queries
SELECT query, calls, mean_time, total_time 
FROM pg_stat_statements 
WHERE query LIKE '%beaches_residential%' 
ORDER BY total_time DESC 
LIMIT 10;
```

## Implementation Priority

### Phase 1: Critical Performance Indexes (Implement First)

These indexes provide the maximum performance improvement for the area-profile page:

```sql
-- 1. Window function optimization (HIGHEST PRIORITY)
CREATE INDEX CONCURRENTLY idx_beaches_residential_listing_timestamp_desc 
ON mls.beaches_residential (listing_id, timestamp DESC) 
WHERE listing_id IS NOT NULL;

-- 2. Status and date filtering
CREATE INDEX CONCURRENTLY idx_beaches_residential_status_dates 
ON mls.beaches_residential (status, listing_date DESC, sold_date DESC, under_contract_date DESC, price_change_timestamp DESC) 
WHERE listing_id IS NOT NULL;

-- 3. Price filtering (list price)
CREATE INDEX CONCURRENTLY idx_beaches_residential_list_price_numeric 
ON mls.beaches_residential (status, (list_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND list_price IS NOT NULL 
  AND list_price != '';
```

**Expected Impact**: 70-90% improvement in query response times

### Phase 2: Query-Specific Optimization

After Phase 1 is complete and stable, implement these targeted indexes:

```sql
-- 4. Active listings optimization
CREATE INDEX CONCURRENTLY idx_beaches_residential_active_listings 
ON mls.beaches_residential (status, city, (list_price::numeric), listing_date DESC) 
WHERE listing_id IS NOT NULL 
  AND status = 'Active' 
  AND list_price IS NOT NULL 
  AND list_price != '';

-- 5. Recent sales optimization
CREATE INDEX CONCURRENTLY idx_beaches_residential_recent_sales 
ON mls.beaches_residential (status, city, (sold_date::date), (sold_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND status = 'Closed' 
  AND sold_date IS NOT NULL 
  AND sold_date != '';

-- 6. Under contract properties
CREATE INDEX CONCURRENTLY idx_beaches_residential_under_contract 
ON mls.beaches_residential (status, city, (under_contract_date::date), (list_price::numeric)) 
WHERE listing_id IS NOT NULL 
  AND status IN ('Active Under Contract', 'Pending');
```

**Expected Impact**: 60-85% improvement in specific endpoint queries

### Phase 3: Advanced Optimization

Implement after monitoring Phase 1 & 2 performance:

```sql
-- 7. Complex JOIN optimization
CREATE INDEX CONCURRENTLY idx_beaches_residential_parcel_join 
ON mls.beaches_residential (parcel_id, listing_id, timestamp DESC) 
WHERE listing_id IS NOT NULL 
  AND parcel_id IS NOT NULL 
  AND parcel_id != '';

-- 8. Market statistics aggregation
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
```

## Implementation Commands

### Step 1: Execute Phase 1 Indexes

```bash
# Connect to your PostgreSQL database
psql -h your-host -d your-database -U your-user

# Run Phase 1 indexes one at a time
\i market-report/database/performance_indexes.sql
```

### Step 2: Monitor and Validate

After each phase, monitor the impact:

```sql
-- Check index creation progress
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes 
WHERE tablename = 'beaches_residential'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Verify index usage
SELECT 
    schemaname,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'beaches_residential' 
  AND indexname LIKE 'idx_beaches_residential%'
ORDER BY idx_scan DESC;
```

### Step 3: Update Table Statistics

After creating indexes:

```sql
-- Update table statistics for query planner
ANALYZE mls.beaches_residential;
ANALYZE waterfrontdata.development_data;
```

## Performance Testing

Test each area-profile endpoint before and after:

1. **Stats Endpoint**: `/areas/{areaId}/stats`
2. **Active Listings**: `/areas/{areaId}/active-listings`
3. **Recent Sales**: `/areas/{areaId}/recent-sales`
4. **Under Contract**: `/areas/{areaId}/under-contract`
5. **Coming Soon**: `/areas/{areaId}/coming-soon`
6. **Price Changes**: `/areas/{areaId}/price-changes`

## Monitoring and Maintenance

### Weekly Monitoring

```sql
-- Check for unused indexes (after 1 week)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes 
WHERE tablename = 'beaches_residential' 
  AND indexname LIKE 'idx_beaches_residential%'
  AND idx_scan < 10
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Monthly Maintenance

```sql
-- Check for index bloat and rebuild if needed
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS current_size
FROM pg_stat_user_indexes 
WHERE tablename = 'beaches_residential'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Refresh statistics
ANALYZE mls.beaches_residential;
```

## Rollback Plan

If any index causes performance issues:

```sql
-- Drop specific index
DROP INDEX CONCURRENTLY mls.idx_beaches_residential_listing_timestamp_desc;

-- Drop all new indexes (emergency rollback)
-- Replace with actual index names created
DROP INDEX CONCURRENTLY mls.idx_beaches_residential_listing_timestamp_desc;
DROP INDEX CONCURRENTLY mls.idx_beaches_residential_status_dates;
-- ... etc
```

## Expected Results

After full implementation:

- **Page Load Time**: 60-80% faster
- **API Response Times**: 70-90% improvement
- **Database CPU Usage**: 40-60% reduction during peak loads
- **Concurrent User Capacity**: 2-3x increase

## Troubleshooting

### Index Creation Fails

1. **Disk space**: Ensure sufficient space (indexes can be 20-40% of table size)
2. **Long-running queries**: Wait for completion or kill blocking queries
3. **Memory issues**: Increase `maintenance_work_mem` temporarily

### Performance Doesn't Improve

1. **Query plan check**: Use `EXPLAIN ANALYZE` to verify index usage
2. **Statistics outdated**: Run `ANALYZE` on the table
3. **Wrong index**: Review query patterns and adjust index columns

### Queries Become Slower

1. **Query plan regression**: PostgreSQL may choose wrong index
2. **Index bloat**: Rebuild indexes with `REINDEX CONCURRENTLY`
3. **Statistics skew**: Update statistics more frequently

## Support Commands

```sql
-- Force index usage (for testing)
SET enable_seqscan = OFF;

-- Check query execution plans
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM (...your area-profile query...);

-- Reset query plan cache
SELECT pg_stat_reset();
``` 