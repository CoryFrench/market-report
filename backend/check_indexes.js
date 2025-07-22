const DatabaseService = require('./src/services/database.js');
const dbService = new DatabaseService();

const query = `
  SELECT 
    schemaname, 
    tablename, 
    indexname, 
    indexdef 
  FROM pg_indexes 
  WHERE schemaname IN ('mls', 'waterfrontdata') 
    AND tablename IN ('beaches_residential', 'development_data')
`;

dbService.query(query)
  .then(res => {
    console.log("Existing Indexes:");
    console.table(res.rows);
  })
  .catch(err => {
    console.error("Error fetching indexes:", err);
  })
  .finally(() => {
    dbService.close();
  }); 