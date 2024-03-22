import { useEffect, useState, useRef } from "react"
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGLWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker?worker'
import 'mapbox-gl/dist/mapbox-gl.css'

import { usePosition } from './usePosition.jsx'
import { getDistance } from './getDistance.jsx'
import drops from './drops.js'

mapboxgl.workerClass = MapboxGLWorker
mapboxgl.accessToken = 'pk.eyJ1IjoianVzdGludm9sdGNyZWF0aXZlIiwiYSI6ImNrczY2eDFpYTBieXEzMGxoaDF1Nmd2aXgifQ.0HoSQyn8pH5coK4IxPRhrQ';

export default function Find() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const user = useRef(null)
    const [ zoom, setZoom ] = useState(15)
    const [ mapLoading, setMapLoading ] = useState(true)
    const [ autoActive, setAutoActive ] = useState(true)

    const { latitude, longitude, error } = usePosition({ watch: false, active: autoActive })
    const [ autoLat, setAutoLat ] = useState(null)
    const [ autoLng, setAutoLng ] = useState(null)
    const manualLat = useRef()
    const manualLng = useRef()

    useEffect(() => {
        console.log('Rendering Find Mission')
        return () => { console.log('Unmounting Find Mission') }
    }, [])

    // Initialize the map
    useEffect(() =>{
        if (map.current) return; // initialize map only once
        if (latitude && longitude) {
            setMapLoading(false)
            // console.log(`map initializing at latitude ${latitude} and longitude ${longitude}`)
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/justinvoltcreative/clo625m1z007601qvgwmcegfn',
                center: [ longitude, latitude ],
                zoom: zoom,
                // Uncomment to rotate the map
                // bearing: 180,
                // pitch: 45,
                // antialias: true
            })

            const el = document.createElement('div')
            el.className = "marker"
            el.style.backgroundImage = `url(./images/bracelet-icon.png)`
            el.style.width = `50px`
            el.style.height = `50px`
            el.style.backgroundSize = `100%`

            

            user.current = new mapboxgl.Marker(el)
                .setLngLat([ longitude, latitude ])
                .addTo(map.current)
        
            drops.map((drop, index) => {
                const dropEl = document.createElement('div')
                dropEl.className = "marker"
                dropEl.style.backgroundImage = `url(./images/star-icon.png)`
                dropEl.style.width = `50px`
                dropEl.style.height = `50px`
                dropEl.style.backgroundSize = `100%`
                new mapboxgl.Marker(dropEl)
                    .setLngLat([ drop.longitude, drop.latitude ])
                    .addTo(map.current)
            })
            setAutoLat(latitude)
            setAutoLng(longitude)

        } else {
            console.log('Map is not ready')
        }
    }, [ latitude, longitude ])

    // Update the map
    useEffect(() => {
        if (autoActive) {
            console.log('Updating user coordinates...')
            if (map.current) {
                map.current.easeTo({ 
                    center: [ longitude, latitude ], 
                    // zoom: 15,
                    speed: 0.2
                })
                user.current.setLngLat([ longitude, latitude ])
                for (var i = 0; i < drops.length; i++) {
                    const distance = getDistance(latitude, longitude, drops[i].latitude, drops[i].longitude, drops[i].name)
                    if (distance.inRange === true) { 
                        alert(`${distance.message}`)
                        break
                    }
                }
                setAutoLat(latitude)
                setAutoLng(longitude)
            }
        } else {
            console.log('Tracking paused')
        }
    })

    // Testing purposes only, allow user to manually set position close to a drop point
    // Test Coordinates for Barclays Center
    // -73.976, 40.684
    function manuallySetPosition() {
        if (autoActive) setAutoActive(false)
        if (map) {
            map.current.easeTo({ 
                center: [ manualLng.current.value, manualLat.current.value ], 
                // zoom: 15,
                speed: 0.2
            })
        }
        user.current.setLngLat([ manualLng.current.value, manualLat.current.value ])
        for (var i = 0; i < drops.length; i++) {
            const distance = getDistance(manualLat.current.value, manualLng.current.value, drops[i].latitude, drops[i].longitude, drops[i].name)
            // console.log(distance)
            if (distance.inRange === true) { 
                alert(`${distance.message}`)
                break
            }
        }
    }

    return (<>
        <div className="flex items-center flex-col px-2 w-full relative">
            { mapLoading &&
                <div className="loading-map absolute z-50 h-full bg-black w-full flex items-center justify-center">
                    <p>Loading Map...</p>
                </div>
            }
            <div ref={mapContainer} className="map-container mb-8" />
            
            <p className="mb-2">User Coordinates</p>
            
            <div className="flex mb-8">
                <label className="relative">
                    <div className="flex text-center bg-transparent placeholder-white outline-none  text-white items-center justify-center border-2 p-2 w-32">{ autoLng ? autoLng.toFixed(3) : '' }</div>
                </label>
                <label className="relative">
                    <div className="flex text-center bg-transparent placeholder-white outline-none  items-center justify-center border-2 p-2 w-32">{ autoLat ? autoLat.toFixed(3) : '' }</div>
                </label>
            </div>
            <p className="mb-2">Set Coordinates</p>
            <div className="flex mb-2">
                <label className="relative">
                    <input type="text" ref={ manualLng } className="flex text-center bg-transparent placeholder-white outline-none  text-white items-center justify-center border-2 p-2 w-32" placeholder={ longitude ? longitude.toFixed(3) : '' }></input>
                </label>
                <label className="relative">
                    <input type="text" ref={ manualLat } className="flex text-center bg-transparent placeholder-white outline-none  items-center justify-center border-2 p-2 w-32" placeholder={ latitude ? latitude.toFixed(3) : '' }></input>
                </label>
            </div>
            <p className="mb-0">Test Coordinates for Barclays Center</p>
            <p className="mb-4">-73.976, 40.684</p>
            <div className="mb-4">
                <button className="flex flex-col items-center justify-center bg-white text-black border-2 border-white p-2 w-64" onClick={ manuallySetPosition }>
                    <p>Manually Set Position</p>
                    <p className="mt-0 text-center text-xs">(Turns Off Auto-Tracking)</p>
                </button>
            </div>
            { !autoActive &&
                <div className="mb-8">
                    <button className="flex flex-col items-center jusitfy-center bg-white text-black border-2 border-white p-2 w-64" onClick={ () => setAutoActive(true) }>
                        <p>Turn Auto-Tracking Back On</p>
                    </button>
                </div>
            }
        </div>
    </>)
}