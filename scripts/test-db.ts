import { sql } from '@vercel/postgres';

async function testConnection() {
  const result = await sql`SELECT NOW()`;
  console.log('Database connected!', result.rows[0]);
}

testConnection();