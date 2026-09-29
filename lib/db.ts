import "dotenv/config"

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg" 

const connectionString = process.env.DATABASE_URL 

if (!connectionString){
    throw new Error(" DATABASR_URL is not set")
}

const pool = new Pool({
    connectionString
}) 

export const db = drizzle({
    client : pool,
})

