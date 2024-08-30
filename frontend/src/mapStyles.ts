import type { CircleLayer, LineLayer } from 'react-map-gl/maplibre'

export const bridgeLayer: CircleLayer = {
  id: 'point',
  type: 'circle',
  source: 'bridges',
  paint: {
    'circle-radius': 7,
    'circle-stroke-width': 1,
    'circle-color': [
      'match',
      ['get', 'condition'],
      'P',
      '#C70039',
      'F',
      '#F9E200',
      'G',
      '#1A9850',
      '#fff',
    ],
  },
}

export const highlightedBridgeLayer: CircleLayer = {
  id: 'highlightedPoint',
  type: 'circle',
  source: 'bridges',
  paint: {
    'circle-radius': 7,
    'circle-stroke-width': 1,
    'circle-color': '#ff9f00',
  },
}
export const routeLayer: LineLayer = {
  id: 'line',
  type: 'line',
  source: 'route',
  paint: {
    'line-width': 5,
    'line-color': '#0198BD',
  },
}
