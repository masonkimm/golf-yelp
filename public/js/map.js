// showpage map

mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: course.geometry.coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(course.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${course.title}</h5> <p>${course.location}</p>`
    )
  )
  .addTo(map);
