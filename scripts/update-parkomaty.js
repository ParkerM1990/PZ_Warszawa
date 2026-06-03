const fs = require("fs");

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQJ3BLePGBFMy3ocUqFgtjP4Axb2gpuQO5N7WhFCeW_j5C7_Fm3NOKid__opIUmdDY_jEKJhUwXQnx/pub?gid=0&single=true&output=csv";

async function main() {
  const response = await fetch(CSV_URL);
  const csv = await response.text();

  const lines = csv.trim().split("\n");

  const data = lines.slice(1).map(line => {
    const cols = line.split(",");

    return {
      id: Number(cols[0]),
      location: cols[1],
      lng: Number(cols[2]),
      lat: Number(cols[3]),
      node: cols[4],
      structure: cols[5]
    };
  });

  fs.writeFileSync(
    "parkomaty.json",
    JSON.stringify(data, null, 2)
  );

  console.log(`Zapisano ${data.length} parkomatów`);
}

main();
