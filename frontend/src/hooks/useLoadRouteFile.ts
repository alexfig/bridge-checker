import type { FeatureCollection, LineString } from 'geojson'
import { ChangeEvent, useState } from 'react'

function useLoadRouteFile() {
  const [route, setRoute] = useState<FeatureCollection<LineString> | null>(null)
  const loadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const json = await e.target.files[0].text()
    setRoute(JSON.parse(json))
  }

  return { route, loadFile }
}
export default useLoadRouteFile
