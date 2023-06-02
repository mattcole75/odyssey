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
        
        // disable map zoom when using scroll
        map.current.scrollZoom.disable();
        // Add zoom and rotation controls to the map.
        map.current.addControl(new mapboxgl.NavigationControl());
    });

    useEffect(() => {
        if(!map.current)
            return;

        if(location != null) {
            map.current.on('load', () => {

                if(locationType === 'area') { // Polygon

                    // add polygon to the map
                    map.current.flyTo({ center: map.current.getCenter().ru });
                    const coordinates = JSON.parse(location).features[0].geometry.coordinates[0];
                    const bounds = coordinates.reduce((bounds, coord) => {
                        return bounds.extend(coord);
                    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                    map.current.fitBounds(bounds, {
                        padding: 40
                    });

                    map.current.addSource(name, { type: 'geojson', data: JSON.parse(location) });

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
                    new mapboxgl.Marker().setLngLat(JSON.parse(location).features[0].geometry.coordinates).addTo(map.current);
                    map.current.flyTo({ center: JSON.parse(location).features[0].geometry.coordinates });
                }
            });
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
            <div ref={ mapContainer } className='map-container border rounded mt-0 mb-0' />
        </div>
    );
}

export default LocationView;