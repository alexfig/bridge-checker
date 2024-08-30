import { Input } from '@/components/ui/input'
import type { FilterSpecification } from 'maplibre-gl'
import { useMemo, useState } from 'react'
import Map, { Layer, MapProvider, Source } from 'react-map-gl/maplibre'

import BridgeTable from './components/BridgeTable'
import QueryInput from './components/QueryInput'
import useFetchBridges from './hooks/useFetchBridges'
import useLoadRouteFile from './hooks/useLoadRouteFile'
import { bridgeLayer, highlightedBridgeLayer, routeLayer } from './mapStyles'

function App() {
  const { route, loadFile } = useLoadRouteFile()
  const [queryString, setQueryString] = useState<string | null>(null)

  const bridges = useFetchBridges(route, queryString)

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const filter = useMemo(() => ['==', ['get', 'id'], hoveredId] as FilterSpecification, [hoveredId])

  return (
    <div className="flex h-screen">
      <MapProvider>
        <div className="h-full flex flex-col w-2/5 p-6">
          <Input type="file" onChange={loadFile} className="my-4" />
          <QueryInput onSearch={setQueryString} />
          {bridges && <BridgeTable bridges={bridges?.features} onHover={setHoveredId} />}
        </div>
        <Map
          id="bridgeMap"
          initialViewState={{
            longitude: -79.797380555555,
            latitude: 40.441963888888,
            zoom: 8,
          }}
          style={{ flex: '1' }}
          mapStyle={`https://api.maptiler.com/maps/basic-v2/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
        >
          <Source id="route" type="geojson" data={route}>
            <Layer {...routeLayer} />
          </Source>
          <Source id="bridges" type="geojson" promoteId="id" data={bridges}>
            <Layer {...bridgeLayer} />
            <Layer {...highlightedBridgeLayer} filter={filter} />
          </Source>
        </Map>
      </MapProvider>
    </div>
  )
}

export default App
