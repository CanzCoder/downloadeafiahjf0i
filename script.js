async function downloadVideo() {
  const url = document.getElementById("url").value;
  const result = document.getElementById("result");

  if (!url) {
    result.innerHTML = "Masukkan link dulu!";
    return;
  }

  result.innerHTML = "Processing...";

  try {
    const response = await fetch("/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (data.status) {
      result.innerHTML = `
        <p>${data.title}</p>
        <a href="${data.video}" target="_blank">
          <button>Download Video</button>
        </a>
      `;
    } else {
      result.innerHTML = data.message;
    }

  } catch (err) {
    result.innerHTML = "Error koneksi ke server";
  }
}
