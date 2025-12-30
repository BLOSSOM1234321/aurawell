import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function createDatabase() {
  // Connect to postgres (default database) first
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database already exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'aurawell_db']
    );

    if (checkDb.rows.length > 0) {
      console.log('✅ Database already exists!');
    } else {
      // Create database
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'aurawell_db'}`);
      console.log(`✅ Database '${process.env.DB_NAME || 'aurawell_db'}' created successfully!`);
    }

    await client.end();
    console.log('\n🎉 Ready to run migrations! Run: npm run migrate\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Tip: Check your DB_PASSWORD in the .env file\n');
    }
    process.exit(1);
  }
}

createDatabase();
