

    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
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
