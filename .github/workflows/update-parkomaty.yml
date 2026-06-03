const https = require('https');
const fs = require('fs');

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQJ3BLePGBFMy3ocUqFgtjP4Axb2gpuQO5N7WhFCeW_j5C7_Fm3NOKid__opIUmdDY_jEKJhUwXQnx/pub?gid=0&single=true&output=csv";

https.get(CSV_URL, res => {

  let data = '';

  res.on('data', chunk => data += chunk);

  res.on('end', () => {

    const lines = data.split('\n').slice(1);

    const result = lines
      .map(line => line.split(','))
      .filter(r => r.length > 4 && r[0])
      .map(r => ({
        id: r[0],
        location: r[1],
        lng: parseFloat(r[2]),
        lat: parseFloat(r[3]),
        node: r[4]
      }));

    fs.writeFileSync('parkomaty.json', JSON.stringify(result, null, 2));

    console.log("✅ Zaktualizowano parkomaty.json");

  });

}).on('error', err => {
  console.error("❌ Błąd pobierania:", err);
});
