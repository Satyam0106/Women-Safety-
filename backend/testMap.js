const { getNearbyPoliceStations } = require("./src/services/mapService");

async function testMap() {
  const delhiLat = 28.6139;
  const delhiLon = 77.2090;
  
  console.log(`Testing nearby police stations for Delhi coordinates: ${delhiLat}, ${delhiLon}`);
  const stations = await getNearbyPoliceStations(delhiLat, delhiLon);
  
  console.log("\nResults FOUND:");
  stations.forEach((s, i) => {
    console.log(`${i+1}. ${s.name}`);
    console.log(`   Address: ${s.address}`);
    console.log(`   Location: ${s.latitude}, ${s.longitude}`);
    console.log('---');
  });
  process.exit(0);
}

testMap();
