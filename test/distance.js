var geolib = require("geolib")

var distance = geolib.getDistance(
  { latitude: 42.06417, longitude: 141.34694 },
  { latitude: 26.2125, longitude: 127.68111 }
)

console.log("distance: ",(distance/1000)+"km")
