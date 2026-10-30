import { Fragment, useEffect, useRef, useState } from 'react'

import * as pmtiles from 'pmtiles'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import classes from './Map.module.css'

const MaplibreGL = (props) => {
  const { style = 'https://demotiles.maplibre.org/style.json' } = props
  const { isPMTiles = false } = props
  const { PMTILES_URL = '' } = props

  const mapContainerRef = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (isPMTiles) {
      let protocol = new pmtiles.Protocol()
      maplibregl.addProtocol('pmtiles', protocol.tile)
      const p = new pmtiles.PMTiles(PMTILES_URL)
      protocol.add(p)

      var map
      p.getHeader().then((h) => {
        map = new maplibregl.Map({
          minZoom: h.minZoom - 1,
          maxZoom: h.maxZoom - 1,
          zoom: h.centerZoom - 1,
          maxBounds: [
            [h.minLon, h.minLat],
            [h.maxLon, h.maxLat],
          ],
          center: [h.centerLon, h.centerLat],
          container: mapContainerRef.current,
          style: {
            version: 8,
            name: 'Custom Raster Tiles',
            center: [0, 0],
            zoom: 0,
            bearing: 0,
            pitch: 0,
            sources: {
              tiles: {
                type: 'raster',
                url: 'pmtiles://http://127.0.0.1:8080/data/osm-taipei-city.pmtiles',
                tileSize: 256,
                attribution:
                  '&copy; <a href="https://github.com/YuChunTsao" target="_blank">YuChunTsao</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
              },
            },
            layers: [
              {
                id: 'osm-taipei-raster-tiles',
                type: 'raster',
                source: 'tiles',
                minzoom: 0,
                maxzoom: 14,
              },
            ],
          },
        })
        setMap(map)

        // Add Navigation Control
        map.addControl(new maplibregl.NavigationControl())
      })

      // Clean up function
      return () => map.remove()
    }

    if (!isPMTiles) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: style, // stylesheet location
      })
      setMap(map)

      // Add Control
      map.addControl(new maplibregl.NavigationControl())

      // Clean up function
      return () => map.remove()
    }
  }, [])

  return (
    <Fragment>
      <div ref={mapContainerRef} className={classes.map} />
    </Fragment>
  )
}

export default MaplibreGL
