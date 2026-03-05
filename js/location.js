navigator.geolocation.getCurrentPosition(async (pos) => {

  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  // ==============================
  // FORMAT ANGKA
  // ==============================
  const latFix = lat.toFixed(6);
  const lonFix = lon.toFixed(6);

  // ==============================
  // ELEVASI (API + FALLBACK GPS)
  // ==============================
  let elev = pos.coords.altitude; // fallback dari GPS

  try {
    const elevRes = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
    );

    if (elevRes.ok) {
      const elevData = await elevRes.json();

      if (
        elevData.results &&
        elevData.results.length > 0 &&
        typeof elevData.results[0].elevation === "number"
      ) {
        elev = elevData.results[0].elevation;
      }
    }
  } catch (err) {
    console.warn("Elevasi API gagal, pakai altitude GPS");
  }

  // Jika tetap null
  if (elev === null || elev === undefined) {
    elev = 0;
  }

  // ==============================
  // TAMPIL KOORDINAT + ELEVASI
  // ==============================
  document.getElementById("coords").innerText =
    `${latFix}, ${lonFix} - ${Number(elev).toFixed(2)} mdpl`;

  // ==============================
  // REVERSE GEOCODING
  // ==============================
  let addressText = `${latFix}, ${lonFix}`; // fallback default
  let countryName = "";
  let countryCode = "";

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data.display_name) {
        addressText = data.display_name;
      }

      if (data.address) {
        countryName = data.address.country || "";
        countryCode = data.address.country_code || "";
      }
    }
  } catch (err) {
    console.warn("Reverse geocoding gagal, pakai koordinat saja");
  }

  // ==============================
  // KONVERSI COUNTRY CODE → EMOJI
  // ==============================
  function countryToFlag(code) {
    if (!code) return "";
    return code
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  }

  const flag = countryToFlag(countryCode);

  // Tambahkan bendera setelah nama negara
  if (countryName && flag) {
    addressText = addressText.replace(
      countryName,
      `${countryName} ${flag}`
    );
  }

  // ==============================
  // TAMPILKAN ALAMAT
  // ==============================
  document.getElementById("address").innerText = addressText;

  // ==============================
  // FORMAT SHARE
  // ==============================
  const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;

  const shareFormat =
`📍 Lokasi saya saat ini :

${addressText}

Koordinat :
${latFix}, ${lonFix}

Elevasi :
${Number(elev).toFixed(2)} mdpl

Google Maps :
${gmaps}

---------------------
MyLoc App :
https://lokasiku.pages.dev`;

  document.getElementById("shareText").innerText = shareFormat;

}, (err) => {
  alert("Izinkan akses lokasi untuk menggunakan aplikasi.");
});
