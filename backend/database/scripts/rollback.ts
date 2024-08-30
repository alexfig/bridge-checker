import { promises as fs } from 'fs'
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import * as path from 'path'
import { Pool } from 'pg'

async function rollback() {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateDown()

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was rolled back successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to rollback migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to rollback')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

rollback()
