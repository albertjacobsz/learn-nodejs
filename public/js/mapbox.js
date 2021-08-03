
export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxiZXJ0amFjb2JzeiIsImEiOiJja3JwcnUwZWoyZ2c3MnVtbHVwenl3enpjIn0.K_b9ZlHMddHbqpSqNuXuLQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/albertjacobsz/ckrpsk9nl6yls17qrlie2tqu2',
        center: [-118.313765, 33.992424],
        zoom: 10,
        scrollZoom: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'marker'
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map)
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`).addTo(map)
        bounds.extend(loc.coordinates)
    })
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 200,
            left: 100,
            right: 100
        }
    })
}