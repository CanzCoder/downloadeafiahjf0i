const axios = require("axios");

module.exports = async (req, res) => {
  // CORS (penting untuk Vercel)
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Content-Type"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Test endpoint via browser
  if (req.method === "GET") {
    return res.status(200).json({
      status: true,
      message: "API CanzDownloader aktif"
    });
  }

  // Hanya POST
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method tidak diizinkan"
    });
  }

  try {
    const { url } = req.body || {};

    if (!url) {
      return res.status(400).json({
        status: false,
        message: "URL kosong"
      });
    }

    if (!url.includes("tiktok.com")) {
      return res.status(400).json({
        status: false,
        message: "Link harus TikTok"
      });
    }

    // Request ke API TikTok downloader
    const response = await axios.post(
      "https://www.tikwm.com/api/",
      { url },
      {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = response.data;

    if (!data?.data?.play) {
      return res.status(404).json({
        status: false,
        message: "Video tidak ditemukan"
      });
    }

    return res.status(200).json({
      status: true,
      video: data.data.play,
      title: data.data.title || "TikTok Video",
      cover: data.data.cover || null
    });

  } catch (error) {
    console.log("ERROR:", error.message);

    return res.status(500).json({
      status: false,
      message: "Gagal mengambil data dari API"
    });
  }
};
