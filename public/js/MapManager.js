function MapManager(){
    this.travelMode = 'walking';
    this.strokeColor = '#16A6B6';
    this.strokeOpacity = 0.8;
    this.strokeWeight = 5;
}

MapManager.prototype.initMap = function(origin,destination,zoom){

    var center = this.calcCenterPosition(origin,destination)

    var lat = center.lat;//緯度
    var lng = center.lng;//経度
    this.map = new GMaps({
        div: "#map",//id名
        lat: lat,
        lng: lng,
        zoom: zoom//縮尺
    })
}

MapManager.prototype.initMapArray = function(lat,lng,zoom){

    this.map = new GMaps({
        div: "#map",//id名
        lat: lat,
        lng: lng,
        zoom: zoom//縮尺
    })
}

MapManager.prototype.drawRoute = function(originLat,originLng, destinationLat,destinationLng){
    this.map.drawRoute({
        origin: [originLat, originLng],//出発点の緯度経度
        destination: [destinationLat, destinationLng],//目標地点の緯度経度
        travelMode: this.travelMode,//モード(walking,driving)
        strokeColor: this.strokeColor,//ルートの色                                                                                     
        strokeOpacity: this.strokeOpacity,//ルートの透明度
        strokeWeight: this.strokeWeight//ルート線の太さ
    })
}

MapManager.prototype.addMarker = function(lat,lng,title,content){
    this.map.addMarker({
        lat: lat,
        lng: lng,
        title: title,
        infoWindow: {
            content: content
        }
    })
}

MapManager.prototype.calcCenterPosition = function(origin,destination){
    var center = {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2
    }

    center.lat = center.lat + 0.001

    return center
}

MapManager.prototype.calcCenterPositionArray = function(latArr,lngArr){
    
    var sumLat = 0;
    var sumLng = 0;
    for (var i in latArr) {
        sumLat += latArr[i];
    }
    for (var i in lngArr) {
        sumLng += lngArr[i];
    }
    sumLat = sumLat / latArr.length;
    sumLng = sumLng / lngArr.length;

    var center = {
        lat: sumLat,
        lng: sumLng
    }

    return center
}

window.mapManager = new MapManager()



