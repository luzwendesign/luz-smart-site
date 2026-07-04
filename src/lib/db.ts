import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      landing_page_id TEXT NOT NULL,
      landing_page_slug TEXT,
      landing_page_title TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      whatsapp TEXT NOT NULL,
      message TEXT,
      source TEXT DEFAULT 'form',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id)`
  await sql`CREATE INDEX IF NOT EXISTS leads_lp_id_idx ON leads(landing_page_id)`
}
