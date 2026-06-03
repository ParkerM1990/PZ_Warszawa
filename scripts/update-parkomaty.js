const https = require("https");
const fs = require("fs");

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQJ3BLePGBFMy3ocUqFgtjP4Axb2gpuQO5N7WhFCeW_j5C7_Fm3NOKid__opIUmdDY_jEKJhUwXQnx/pub?gid=0&single=true&output=csv";

function clean(v) {
  return String(v || "")
    .replace(/\r/g, "")
    .replace(/^"|"$/g, "")
    .trim();
}

function toNumber(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

console.log("🚀 START");

https
  .get(CSV_URL, (res) => {
    console.log("📡 STATUS HTTP:", res.statusCode);

    if (res.statusCode !== 200) {
      console.error("❌ Błąd pobierania CSV");
      return;
    }

    let data = "";

    res.on("data", (chunk) => (data += chunk));

    res.on("end", () => {
      console.log("📦 Długość danych:", data.length);

      // 🔴 jeśli Google zwróci HTML zamiast CSV
      if (!data.includes(",")) {
        console.error("❌ TO NIE JEST CSV!");
        console.log(data.slice(0, 300));
        return;
      }

      const lines = data
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter((l) => l.trim());

      console.log("📄 Linie:", lines.length);

      const result = lines
        .slice(1)
        .map((line) => line.split(",").map(clean))
        .map((r) => ({
          id: r[0],
          location: r[1],
          lng: toNumber(r[2]),
          lat: toNumber(r[3]),
          node: r[4],
          structure: r[5] || "",
        }))
        .filter((r) => r.id && r.lat !== null && r.lng !== null);

      console.log("📊 Parkomaty:", result.length);

      const outputPath = __dirname + "/parkomaty.json";

      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf8");

      console.log("✅ ZAPISANO:", outputPath);
    });
  })
  .on("error", (err) => {
    console.error("❌ Błąd sieci:", err);
  });
