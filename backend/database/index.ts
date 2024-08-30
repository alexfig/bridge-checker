import { Kysely, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  log(event) {
    if (event.level === 'error') {
      console.error('Query failed : ', {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: event.query.sql,
        params: event.query.parameters,
      })
    } else {
      console.log('Query executed : ', {
        durationMs: event.queryDurationMillis,
        sql: event.query.sql,
        params: event.query.parameters,
      })
    }
  },
})
