require('dotenv').config();

console.log('Environment variables:');
console.log('Password:', JSON.stringify(process.env.PG_PASSWORD));
console.log('Password length:', process.env.PG_PASSWORD ? process.env.PG_PASSWORD.length : 'undefined');
console.log('Full password should be: Waterfront#1'); 