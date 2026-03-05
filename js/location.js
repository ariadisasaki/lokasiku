navigator.geolocation.getCurrentPosition(async pos => {

  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  try {

    // ==============================
    // ELEVASI REAL (Open-Elevation)
    // ==============================
    const elevRes = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
    );
    const elevData = await elevRes.json();
    const elev = elevData.results?.[0]?.elevation ?? 0;

    document.getElementById("coords").innerText =
      `${lat.toFixed(6)}, ${lon.toFixed(6)} - ${elev.toFixed(2)} mdpl`;


    // ==============================
    // REVERSE GEOCODING (Nominatim)
    // ==============================
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    const addr = data.address || {};

    document.getElementById("address").innerText =
      data.display_name || "";


    // ==============================
    // KONVERSI COUNTRY CODE → BENDERA
    // ==============================
    function countryToFlag(code) {
      if (!code) return "";
      return code
        .toUpperCase()
        .replace(/./g, char =>
          String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    const flag = countryToFlag(addr.country_code);


    // ==============================
    // FORMAT ADMINISTRATIF LENGKAP
    // ==============================
    const wilayahParts = [];

    // Desa / Kelurahan
    if (addr.village) {
      wilayahParts.push(`Desa ${addr.village}`);
    } else if (addr.suburb) {
      wilayahParts.push(`Kelurahan ${addr.suburb}`);
    }

    // Kecamatan
    if (addr.city_district) {
      wilayahParts.push(`Kecamatan ${addr.city_district}`);
    }

    // Kabupaten
    if (addr.county) {
      wilayahParts.push(`Kabupaten ${addr.county}`);
    }

    // Provinsi
    if (addr.state) {
      wilayahParts.push(`Provinsi ${addr.state}`);
    }

    // Negara + Bendera
    if (addr.country) {
      wilayahParts.push(`${addr.country}${flag ? " " + flag : ""}`);
    }

    const wilayahText = wilayahParts.join(", ");

    document.getElementById("description").innerText =
      wilayahText
        ? `Wilayah ini termasuk ${wilayahText}`
        : "";


    // ==============================
    // FORMAT SHARE
    // ==============================
    const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;

    const shareFormat =
`📍 Lokasi saya saat ini :

${data.display_name || "-"}

Koordinat :
${lat.toFixed(6)}, ${lon.toFixed(6)}

Elevasi :
${elev.toFixed(2)} mdpl

Google Maps :
${gmaps}

---------------------
MyLoc App :
https://lokasiku.pages.dev`;

    document.getElementById("shareText").innerText = shareFormat;

  } catch (error) {
    console.error(error);
    alert("Gagal mengambil data lokasi. Periksa koneksi internet Anda.");
  }

}, err => {
  alert("Izinkan akses lokasi untuk menggunakan aplikasi.");
});
