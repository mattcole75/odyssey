import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Source, Layer } from 'mapbox-gl';
import { mapBoxKey } from '../../../../config/config';

const LocationView = (props) => {

    const { name, location } = props;

    let loc = JSON.parse(location);

    // set up the mapbox components
    mapboxgl.accessToken = mapBoxKey;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-2.237827);
    const [lat, setLat] = useState(53.480699);
    const [zoom, setZoom] = useState(16);

    useEffect(() => {
        if(map.current)
            return;
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            // style: 'mapbox://styles/mapbox/light-v11', // style URL
            style: 'mapbox://styles/mattcole75/clfifj5rj005701o0ibg3a3ip',
            center: [-2.238546, 53.481078], // starting position
            zoom: 9 // starting zoom
        });
    });

    useEffect(() => {
        if(!map.current)
            return;

        if(loc != null) {
            map.current.on('load', () => {
                console.log(loc);
                // console.log('MC', JSON.parse(location));

                if(loc.type === 'geojson') {
                    map.current.addSource(name, loc);

                    // Add an outline around the polygon.
                    map.current.addLayer({
                        'id': 'outline',
                        'type': 'line',
                        'source': name,
                        'layout': {},
                        'paint': {
                            'line-color': '#0080ff',
                            'line-width': 3
                        }
                    });
                } else {

                    new mapboxgl.Marker().setLngLat(loc.geometry.coordinates).addTo(map.current);
                }
                

                // Create default markers
                // geoJson.features.map((feature) =>
                //     new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map)
                // );
                


                
            });

            // Add navigation control (the +/- zoom buttons)
            // map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        }

        // Clean up on unmount
        // return () => map.current.remove();

    });

    return (
        <div className='container'>
            <div ref={ mapContainer } className='map-container' />
        </div>
    );
}

export default LocationView;