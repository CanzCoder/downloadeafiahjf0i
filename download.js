const axios = require("axios");

module.exports = async (req, res) => {
  // Hanya POST
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method tidak diizinkan"
    });
  }

  const { url } = req.body;

  if (!url) {
    return res.json({
      status: false,
      message: "URL kosong"
    });
  }

  if (!url.includes("tiktok.com")) {
    return res.json({
      status: false,
      message: "Link harus TikTok"
    });
  }

  try {
    const apiUrl = "https://www.tikwm.com/api/";

    const response = await axios.post(
      apiUrl,
      { url: url },
      {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = response.data;

    if (!data || !data.data || !data.data.play) {
      return res.json({
        status: false,
        message: "Video tidak ditemukan"
      });
    }

    return res.json({
      status: true,
      video: data.data.play,
      title: data.data.title || "TikTok Video"
    });

  } catch (error) {
    return res.json({
      status: false,
      message: "Gagal mengambil data dari API"
    });
  }
};
