import * as dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false, // For development only; for production, set up proper SSL validation
  },
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL");

  // Example query
  const res = await client.query("SELECT NOW()");
  console.log("Current time in PostgreSQL:", res.rows[0]);

  await client.end();
}

main().catch(console.error);
