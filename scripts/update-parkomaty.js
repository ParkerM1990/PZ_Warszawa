const fs = require("fs");

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQJ3BLePGBFMy3ocUqFgtjP4Axb2gpuQO5N7WhFCeW_j5C7_Fm3NOKid__opIUmdDY_jEKJhUwXQnx/pub?gid=0&single=true&output=csv";

function clean(v) {
  return String(v || "").replace(/\r/g, "").replace(/^"|"$/g, "").trim();
}

function toNumber(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

console.log("🚀 START");

const res = await fetch(CSV_URL, { redirect: "follow" });
const data = await res.text();

console.log("📦 SIZE:", data.length);

if (!data.includes(",")) {
  console.error("❌ To nie CSV");
  console.log(data.slice(0, 300));
  process.exit(1);
}

const lines = data
  .replace(/^\uFEFF/, "")
  .split(/\r?\n/)
  .filter(l => l.trim());

const result = lines
  .slice(1)
  .map(l => l.split(",").map(clean))
  .map(r => ({
    id: r[0],
    location: r[1],
    lng: toNumber(r[2]),
    lat: toNumber(r[3]),
    node: r[4],
    structure: r[5] || ""
  }))
  .filter(r => r.id && r.lat !== null && r.lng !== null);

fs.writeFileSync("parkomaty.json", JSON.stringify(result, null, 2));

console.log("✅ ZAPISANO:", result.length);
