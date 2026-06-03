const fs = require("fs");

function clean(v) {
  return String(v || "")
    .replace(/\r/g, "")
    .trim();
}

function toNumber(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

const csv = fs.readFileSync("parkomaty.csv", "utf8");

// dzielenie na linie
const lines = csv
  .replace(/^\uFEFF/, "")
  .split(/\r?\n/)
  .filter(l => l.trim().length > 0);

// jeśli masz nagłówek:
const data = lines.slice(1);

const result = data.map(line => {
  const cols = line.split(",");

  return {
    id: clean(cols[0]),
    location: clean(cols[1]),
    lng: toNumber(cols[2]),
    lat: toNumber(cols[3]),
    node: clean(cols[4]),
    structure: clean(cols[5])
  };
}).filter(r =>
  r.id && r.lat !== null && r.lng !== null
);

fs.writeFileSync("parkomaty.json", JSON.stringify(result, null, 2), "utf8");

console.log("OK → wygenerowano:", result.length, "rekordów");
