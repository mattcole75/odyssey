import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { mapBoxKey } from '../../../../config/config';

const EditMap = (props) => {

    const { asset, close, save } = props;
    const { name, locationType, location } = asset;

    // set up the mapbox components
    mapboxgl.accessToken = mapBoxKey;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const draw = useRef(null);
    
    const saveHandler = () => {
        save(draw.current.getAll());
        close();
    }
   

    useEffect(() => {
        if(map.current)
            return;
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mattcole75/clfifj5rj005701o0ibg3a3ip' // style URL
            // style: 'mapbox://styles/mattcole75/clid5bqr2002801r0adfa8pj9'
            // style: 'mapbox://styles/mattcole75/clibvg1tf02yu01pnbktxbc60',
            // center: [lng, lat], // starting position
            // zoom: zoom // starting zoom
        });

        draw.current = new MapboxDraw();
        map.current.addControl(draw.current, 'top-right');

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

                    draw.current.add(JSON.parse(location));
                } else { // Point
                    // add Marker to the map and centre
                    map.current.flyTo({ center: JSON.parse(location).features[0].geometry.coordinates });
                    draw.current.add(JSON.parse(location));
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
            <div ref={ mapContainer } className='map-container mt-0 mb-3' />
            <div className='form-floating mb-3'>
                <button
                    className='w-100 btn btn-primary'
                    type='button'
                    onClick={ saveHandler }>Save</button>
            </div>

            <div className='form-floating'>
                <button
                    className='w-100 btn btn-secondary'
                    type='button'
                    onClick={ close }>Close</button>
            </div>
        </div>
    );

}

export default EditMap;