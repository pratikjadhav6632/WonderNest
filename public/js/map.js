const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
        center: [0,0],
        zoom: 2
    });

    const size = 200;
    const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },
        render() {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;
            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            context.clearRect(0, 0, this.width, this.height);

            // Outer pulse
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            context.fillStyle = `rgba(255, 200, 200,${1 - t})`;
            context.fill();

            // Inner dot
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            this.data = context.getImageData(0, 0, this.width, this.height).data;
            map.triggerRepaint();
            return true;
        }
    };

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
                console.warn("No geocoding result for:", location);
                return null;
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    }

    map.on('load', async () => {
        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

        const coords = await getCoordinatesFromLocation(locationName);
        if (coords) {
            const lngLat = [coords.lon, coords.lat];

            // Center map on location
            map.setCenter(lngLat);
            map.setZoom(12);

            // Add pulsing dot as a GeoJSON source + layer
            map.addSource('location-point', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: lngLat
                        }
                    }]
                }
            });

            map.addLayer({
                id: 'location-point-layer',
                type: 'symbol',
                source: 'location-point',
                layout: {
                    'icon-image': 'pulsing-dot'
                }
            });
        }
        const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false
});

// Show popup on mouse enter
map.on('mouseenter', 'location-point-layer', (e) => {
    // Change cursor to pointer
    map.getCanvas().style.cursor = 'pointer';

    // Get coordinates
    const coordinates = e.features[0].geometry.coordinates.slice();
    
    // Customize the label here
    const location =locationName;
    const listings=listing;

    // Set and show the popup
    popup
        .setLngLat(coordinates)
        .setHTML(`<h4>${listings}</h4><strong>Exact location will be provided after Booking</strong>`)
        .addTo(map);
});

// Hide popup on mouse leave
map.on('mouseleave', 'location-point-layer', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
});
    });