import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { mapBoxKey } from '../../../../config/config';

const LocationView = (props) => {

    const { asset } = props;
    const { name, locationType, location } = asset;

    // set up the mapbox components
    mapboxgl.accessToken = mapBoxKey;
    const mapContainer = useRef(null);
    const map = useRef(null);
    // const [lng, setLng] = useState(-2.238546);
    // const [lat, setLat] = useState(53.481078);
    // const [zoom] = useState(16);

    // useEffect(() => {

    //     if(map.current)
    //         map.current.remove();

    // },[location]);

    useEffect(() => {
        if(map.current)
            return;
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            // style: 'mapbox://styles/mapbox/light-v11', // style URL
            style: 'mapbox://styles/mattcole75/clfifj5rj005701o0ibg3a3ip',
            // center: [lng, lat], // starting position
            // zoom: zoom // starting zoom
        });

        // return () => map.current.remove();
        
    });

    useEffect(() => {
        if(!map.current)
            return;

        if(location != null) {
            map.current.on('load', () => {
                // const loc = JSON.parse(location);

                if(locationType === 'area') { // Polygon
                    // add polygon to the map
                    map.current.flyTo({ center: map.current.getCenter().ru });
                    const coordinates = JSON.parse(location).data.geometry.coordinates[0];
                    const bounds = coordinates.reduce((bounds, coord) => {
                        return bounds.extend(coord);
                    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                    map.current.fitBounds(bounds, {
                        padding: 40
                    });
                    map.current.addSource(name, JSON.parse(location));
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
                } else { // Point
                    // add Marker to the map and centre
                    new mapboxgl.Marker().setLngLat(JSON.parse(location).geometry.coordinates).addTo(map.current);
                    map.current.flyTo({ center: JSON.parse(location).geometry.coordinates });
                }
            });

            // Add navigation control (the +/- zoom buttons)
            // map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
            //map.addControl(Draw, 'top-left');
        }

        // Clean up on unmount
        // return () => map.current.remove();
        return () => {
            map.current.remove();
            map.current = null;
        };

    }, [location, locationType, name]);

    return (
        <div className='container ps-0 pe-0'>
            <div ref={ mapContainer } className='map-container mt-0 mb-0' />
        </div>
    );
}

export default LocationView;