import 'dotenv/config';

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  database: process.env.DB,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

await client.connect();

export default client;


