import { expressionBuilder } from 'kysely'
import { DB } from 'kysely-codegen'
import { db } from '../database'

const SEARCHABLE_COLUMN = [
  'id',
  'structure_number',
  'condition',
  'feature_description',
  'facility_carried',
  'location',
  'lat',
  'long',
  'year_built',
  'adt',
  'year_adt',
] as const

const OPERATORS = ['=', '<', '>', '<=', '>=', 'in'] as const

export async function getBridgesAlongRoute({
  route,
  query: queryParams = [],
}: {
  route: [number, number][] | null
  query: Expression[] | null
}) {
  const routeGeog = route && createGeographyFromRoute(route)

  let query = db
    .selectFrom('bridge')
    .select(SEARCHABLE_COLUMN)
    .where(buildQueryExpression(queryParams))

  if (routeGeog) {
    query = query
      .where(eb => eb.fn('ST_DWithin', [routeGeog, 'bridge.geog', eb.val(6)]))
      .orderBy(eb => eb.fn('ST_LineLocatePoint', [routeGeog, 'bridge.geog']))
  }

  const res = await query.limit(10000).execute()

  return res
}

function createGeographyFromRoute(route: [number, number][]) {
  const eb = expressionBuilder<DB, 'bridge'>()
  const routeStr = route.map(p => `${p[0]} ${p[1]}`).join(',')

  return eb.fn('ST_GeographyFromText', [eb.val(`SRID=4326;LINESTRING(${routeStr})`)])
}

type SearchableColumn = (typeof SEARCHABLE_COLUMN)[number]
type Operator = (typeof OPERATORS)[number]

type Expression = [SearchableColumn, Operator, string | number | (string | number)[]]

function buildQueryExpression(query: Expression[] | null) {
  const eb = expressionBuilder<DB, 'bridge'>()
  if (!query) return eb.and([])

  const expressions = query.map(exp => eb(...exp))
  return eb.and(expressions)
}
