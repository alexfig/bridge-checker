import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('bridge_condition').asEnum(['P', 'F', 'G']).execute()

  await db.schema
    .createTable('bridge')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('structure_number', 'varchar(15)', col => col.notNull())
    .addColumn('feature_description', 'varchar', col => col.notNull())
    .addColumn('facility_carried', 'varchar', col => col.notNull())
    .addColumn('location', 'varchar', col => col.notNull())
    .addColumn('lat', 'float8', col => col.notNull())
    .addColumn('long', 'float8', col => col.notNull())
    .addColumn('year_built', 'integer', col => col.notNull())
    .addColumn('adt', 'varchar', col => col.notNull())
    .addColumn('year_adt', 'integer', col => col.notNull())
    .addColumn('condition', sql`bridge_condition`)
    .addColumn('geog', sql`geography(POINT,4326)`, col => col.notNull())
    .execute()

  await db.schema
    .createIndex('bridge_location_index')
    .on('bridge')
    .column('geog')
    .using('gist')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('bridge').execute()
  await db.schema.dropType('bridge_condition').ifExists().execute()
}
