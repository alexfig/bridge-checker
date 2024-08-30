import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Feature, Point } from 'geojson'
import { useMap } from 'react-map-gl/maplibre'

const COLS = [
  { key: 'location', header: 'Location' },
  { key: 'condition', header: 'Condition' },
  { key: 'feature_description', header: 'Feature Desc' },
  { key: 'facility_carried', header: 'Facility Carried' },
  { key: 'year_built', header: 'Year Built' },
  { key: 'adt', header: 'ADT' },
  { key: 'year_adt', header: 'Year of ADT' },
  { key: 'structure_number', header: 'Structure Number' },
] as const

type BridgeTableProps = { bridges: Feature<Point>[]; onHover: (id: string | null) => void }

function BridgeTable({ bridges, onHover }: BridgeTableProps) {
  const { bridgeMap: map } = useMap()

  return (
    <Table wrapperClassName="rounded-md border">
      <TableHeader className="sticky top-0 bg-accent">
        <TableRow>
          {COLS.map(({ header }) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {bridges.map(
          ({
            properties,
            geometry: {
              coordinates: [lng, lat],
            },
          }) => (
            <TableRow
              key={properties?.id}
              className="cursor-pointer"
              onMouseEnter={() => onHover(properties?.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() =>
                map?.flyTo({ center: [lng, lat], zoom: map.getZoom() < 12 ? 12 : map.getZoom() })
              }
            >
              {COLS.map(({ key }) => (
                <TableCell key={key}>{properties?.[key]}</TableCell>
              ))}
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  )
}

export default BridgeTable
