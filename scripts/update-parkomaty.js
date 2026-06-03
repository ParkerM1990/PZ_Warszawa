const https = require("https");
const fs = require("fs");

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQJ3BLePGBFMy3ocUqFgtjP4Axb2gpuQO5N7WhFCeW_j5C7_Fm3NOKid__opIUmdDY_jEKJhUwXQnx/pub?gid=0&single=true&output=csv";

function clean(v) {
  return String(v || "")
    .replace(/\r/g, "")
    .replace(/^"|"$/g, "")
    .trim();
}

https.get(CSV_URL, res => {

  let data = "";

  res.on("data", chunk => data += chunk);

  res.on("end", () => {

    // ❗ zabezpieczenie: sprawdź czy to CSV
    if (!data.includes(",")) {
      console.error("❌ To nie wygląda jak CSV:");
      console.log(data.slice(0, 200));
      return;
    }

    const lines = data
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter(l => l.trim());

    const result = lines
      .slice(1)
      .map(line => {

        // ❗ lepsze niż split (obsługa cudzysłowów)
        const cols = line
          .split(",")
          .map(clean);

        return {
          id: cols[0],
          location: cols[1],
          lng: parseFloat(cols[2]),
          lat: parseFloat(cols[3]),
          node: cols[4],
          structure: cols[5] || ""
        };
      })
      .filter(r =>
        r.id &&
        !isNaN(r.lat) &&
        !isNaN(r.lng)
      );

    fs.writeFileSync(
      "parkomaty.json",
      JSON.stringify(result, null, 2),
      "utf8"
    );

    console.log("✅ Zaktualizowano:", result.length, "rekordów");

  });

}).on("error", err => {
  console.error("❌ Błąd pobierania:", err);
});
