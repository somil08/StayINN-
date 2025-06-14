// Assuming `mapToken` and `coordinates` are provided in the template
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 10
});

new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .addTo(map);
