let map;

navigator.geolocation.getCurrentPosition(pos => {

  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  map = L.map('map').setView([lat, lon], 17);

  const osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  );

  const satelit = L.tileLayer(
    'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    {
      subdomains:['mt0','mt1','mt2','mt3']
    }
  );

  satelit.addTo(map);

  L.control.layers({
    "Satelit": satelit,
    "OSM": osm
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup("Lokasi Anda Saat Ini")
    .openPopup();

});
