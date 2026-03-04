navigator.geolocation.getCurrentPosition(async pos=>{

const lat=pos.coords.latitude;
const lon=pos.coords.longitude;

// Elevasi REAL
const elevRes=await fetch(
`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
);
const elevData=await elevRes.json();
const elev=elevData.results[0].elevation;

document.getElementById("coords").innerText=
`${lat.toFixed(6)}, ${lon.toFixed(6)} - ${elev.toFixed(2)} mdpl`;

// Reverse Geocoding
const res=await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
);
const data=await res.json();
const address=data.display_name;

document.getElementById("address").innerText=address;

document.getElementById("description").innerText=
`Wilayah ini termasuk ${data.address.county || data.address.city}, ${data.address.state}, ${data.address.country}.`;

const gmaps=`https://www.google.com/maps?q=${lat},${lon}`;

const shareFormat=
`
${address}

Koordinat :
${lat.toFixed(6)}, ${lon.toFixed(6)}

Elevasi :
${elev.toFixed(2)} mdpl

Google Maps :
${gmaps}

---------------------
MyLoc App :
https://lokasiku.pages.dev`;

document.getElementById("shareText").innerText=shareFormat;

});
