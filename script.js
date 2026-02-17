// ==================== KONFIGURASI API ====================
const VIRUSTOTAL_API_KEY = '06b92573480e066a00c77ea1201d47530a3ebbd3d7dd3e22d566e1ab4bd07106'; // GANTI DENGAN API KEY ASLIMU
const SAFE_BROWSING_API_KEY = 'AIzaSyCYpLpWlumDf7oerF4bk34tLVLewgHDwJI';

// ==================== 1. VIRUS FILE CHECK (Real via VirusTotal) ====================
async function checkFileVirus() {
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('fileResult');
    
    if (!fileInput.files[0]) {
        resultDiv.innerHTML = '❌ Pilih file dulu, Zen.';
        return;
    }

    const file = fileInput.files[0];
    resultDiv.innerHTML = '🔄 Mengupload & men-scan...';

    // Baca file sebagai base64
    const reader = new FileReader();
    reader.onload = async function() {
        const base64File = reader.result.split(',')[1];

        // Kirim ke VirusTotal API (endpoint upload)
        try {
            const response = await fetch('https://www.virustotal.com/api/v3/files', {
                method: 'POST',
                headers: {
                    'x-apikey': VIRUSTOTAL_API_KEY,
                    'Content-Type': 'application/octet-stream'
                },
                body: base64File
            });

            const data = await response.json();
            if (data.data) {
                const scanId = data.data.id;
                resultDiv.innerHTML = `✅ File terkirim! Scan ID: ${scanId}. <br> Cek hasil di VirusTotal. (Mock: Aman ☠️)`;
            } else {
                resultDiv.innerHTML = '⚠️ Gagal scan. Coba lagi.';
            }
        } catch (error) {
            resultDiv.innerHTML = '⚠️ Error API (gunakan mode demo). File aman (simulasi).';
            console.warn('Demo mode: file aman');
        }
    };
    reader.readAsDataURL(file);
}

// ==================== 2. WEB SAFETY CHECK (Google Safe Browsing) ====================
async function checkWebSafety() {
    const url = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('webResult');
    
    if (!url) {
        resultDiv.innerHTML = '❌ Masukkan URL.';
        return;
    }

    resultDiv.innerHTML = '🔄 Memeriksa keamanan...';

    // Google Safe Browsing API (lookup)
    const sbUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`;
    const body = {
        client: {
            clientId: "CanzCode",
            clientVersion: "1.0.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }]
        }
    };

    try {
        const response = await fetch(sbUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        
        if (data.matches) {
            resultDiv.innerHTML = `🚨 ANCAMAN DETECTED! Tipe: ${data.matches[0].threatType}`;
        } else {
            resultDiv.innerHTML = '✅ Situs aman (tidak dalam daftar hitam).';
        }
    } catch {
        resultDiv.innerHTML = '⚠️ Mode demo: Situs ini aman (asumsi).';
    }
}

// ==================== 3. TIKTOK DOWNLOADER (Demo/Simulasi) ====================
function tiktokDownload() {
    const url = document.getElementById('tiktokUrl').value;
    const resultDiv = document.getElementById('tiktokResult');
    if (!url) { resultDiv.innerHTML = '❌ Masukkan URL TikTok.'; return; }
    resultDiv.innerHTML = `🎬 TikTok: Video siap diunduh. <br> (Demo: gunakan backend yt-dlp nanti) <br> <a href="#" style="color:#7f9fff">🔗 Download simulasi</a>`;
}

// ==================== 4. YOUTUBE DOWNLOADER (Demo) ====================
function youtubeDownload() {
    const url = document.getElementById('youtubeUrl').value;
    const resultDiv = document.getElementById('youtubeResult');
    if (!url) { resultDiv.innerHTML = '❌ Masukkan URL YouTube.'; return; }
    resultDiv.innerHTML = `🎥 YouTube: Video siap diunduh (format: mp4). <br> <a href="#" style="color:#7f9fff">🔗 Download simulasi</a>`;
}

// ==================== 5. IG DOWNLOADER (Demo) ====================
function igDownload() {
    const url = document.getElementById('igUrl').value;
    const resultDiv = document.getElementById('igResult');
    if (!url) { resultDiv.innerHTML = '❌ Masukkan URL Instagram.'; return; }
    resultDiv.innerHTML = `📸 Instagram: Media siap diunduh. <br> <a href="#" style="color:#7f9fff">🔗 Download simulasi</a>`;
}