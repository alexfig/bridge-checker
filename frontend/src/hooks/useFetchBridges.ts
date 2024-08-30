import type { FeatureCollection, LineString, Point } from 'geojson'
import GeoJSON from 'geojson'
import { useEffect, useState } from 'react'

function useFetchBridges(route: FeatureCollection<LineString> | null, queryString: string | null) {
  const [bridges, setBridges] = useState<FeatureCollection<Point> | null>(null)

  useEffect(() => {
    if (!route && queryString === null) return

    const lineString = route?.features?.find(f => f.geometry.type === 'LineString')

    fetch('http://localhost:4000/bridges/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: lineString?.geometry?.coordinates,
        query: JSON.parse(queryString || '[]'),
      }),
    })
      .then(res => res.json())
      //@ts-expect-error
      .then(data => setBridges(GeoJSON.parse(data, { Point: ['lat', 'long'] })))
  }, [route, queryString])

  return bridges
}
export default useFetchBridges
