// Clock
function updateClock(){
  const now = new Date();

  const hari = now.toLocaleDateString('id-ID', { weekday: 'long' });
  const tanggal = now.toLocaleDateString('id-ID', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const waktu = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  document.getElementById("datetime").innerText =
    `${hari}, ${tanggal} - Pkl. ${waktu}`;
}

setInterval(updateClock, 1000);
updateClock();

// Theme toggle
document.getElementById("themeToggle").onclick=()=>{
  document.body.classList.toggle("light");
};

// Share
document.getElementById("shareBtn").onclick=async()=>{
  const text=document.getElementById("shareText").innerText;
  if(navigator.share){
    await navigator.share({text});
  }else{
    alert("Browser tidak mendukung Web Share API");
  }
};

// Copy
document.getElementById("copyBtn").onclick=()=>{
  const text=document.getElementById("shareText").innerText;
  navigator.clipboard.writeText(text);
  alert("Teks berhasil disalin!");
};

// SW
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js');
}

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// jika app sudah dijalankan sebagai PWA
if (window.matchMedia('(display-mode: standalone)').matches) {

  installBtn.textContent = "✅ App Installed";
  installBtn.classList.add("installed");
  installBtn.disabled = true;

}

// event install tersedia
window.addEventListener("beforeinstallprompt", (e)=>{

  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "inline-block";

});

// klik tombol install
installBtn.addEventListener("click", async ()=>{

  if(!deferredPrompt) return;

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  if(outcome === "accepted"){

    installBtn.textContent = "✅ App Installed";
    installBtn.classList.add("installed");
    installBtn.disabled = true;

  }

  deferredPrompt = null;

});
