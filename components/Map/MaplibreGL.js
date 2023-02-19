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
          center: [h.centerLon, h.centerLat],
          zoom: h.maxZoom,
          minZoom: h.minZoom,
          container: mapContainerRef.current,
          style: style,
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
