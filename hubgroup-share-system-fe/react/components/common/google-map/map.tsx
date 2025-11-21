import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';

interface ReusableMapProps {
    apiKey: string;
    center: google.maps.LatLngLiteral;
    zoom?: number;
    width?: string;
    height?: string;
    children?: React.ReactNode;
}

const ReusableMap: React.FC<ReusableMapProps> = ({
    apiKey,
    center,
    zoom = 12,
    width = '100%',
    height = '400px',
    children,
}) => {
    const containerStyle = {
        width,
        height,
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const onLoad = useCallback(
        (mapInstance: google.maps.Map) => {
            const bounds = new window.google.maps.LatLngBounds(center);
            mapInstance.fitBounds(bounds);
            setMap(mapInstance);
        },
        [center]
    );

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                mapTypeControl: true, // bật chọn loại bản đồ
                streetViewControl: true, // bật street view
                fullscreenControl: true, // bật full screen
                zoomControl: true, // bật zoom control
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, // hoặc HORIZONTAL_BAR
                    position: google.maps.ControlPosition.TOP_RIGHT, // vị trí menu
                    mapTypeIds: [
                        google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.SATELLITE,
                        google.maps.MapTypeId.HYBRID,
                        google.maps.MapTypeId.TERRAIN,
                    ],
                },
            }}>
            {children}
        </GoogleMap>
    ) : null;
};

export default React.memo(ReusableMap);
