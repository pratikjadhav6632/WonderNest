

    const map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            name: 'Blank',
            center: [0, 0],
            zoom: 2,
            sources: {
                'raster-tiles': {
                    type: 'raster',
                    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    minzoom: 0,
                    maxzoom: 19
                }
            },
            layers: [
                {
                    id: 'background',
                    type: 'background',
                    paint: { 'background-color': '#e0dfdf' }
                },
                {
                    id: 'simple-tiles',
                    type: 'raster',
                    source: 'raster-tiles'
                }
            ]
        },
        center: [0, 0],
        zoom: 2
    });

    async function getCoordinatesFromLocation(location) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                return { lat: parseFloat(lat), lon: parseFloat(lon) };
            } else {
                console.warn("No geocoding result found for:", location);
                return null;
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    }

    // Use geocoded location to update map
    (async () => {
        const coords = await getCoordinatesFromLocation(locationName);
        if (coords) {
            const lngLat = [coords.lon, coords.lat];
            map.setCenter(lngLat);
            map.setZoom(13);
            new maplibregl.Marker().setLngLat(lngLat).addTo(map);
        }
    })();
