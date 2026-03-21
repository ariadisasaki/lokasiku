navigator.geolocation.getCurrentPosition(async pos => {

  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  try {

    // ==========
    // KOORDINAT
    // ==========
    document.getElementById("coords").innerText =
      `${lat.toFixed(6)}, ${lon.toFixed(6)}`;


    // ==================
    // REVERSE GEOCODING
    // ==================
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    const addr = data.address || {};

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

    // ========================
    // FORMAT ALAMAT + BENDERA
    // ========================
    let addressText = data.display_name || "";

    if (addr.country && flag) {
      addressText = addressText.replace(
        addr.country,
        `${addr.country} ${flag}`
      );
    }

    document.getElementById("address").innerText = addressText;


    // =============
    // FORMAT SHARE
    // =============
    const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;

    const shareFormat =
`📍 Lokasi saya saat ini :

${addressText}

Koordinat :
${lat.toFixed(6)}, ${lon.toFixed(6)}

Google Maps :
${gmaps}

-----------------------------------
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
