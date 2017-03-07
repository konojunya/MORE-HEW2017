function MapManager(){
    this.travelMode = 'walking';
    this.strokeColor = '#16A6B6';
    this.strokeOpacity = 0.8;
    this.strokeWeight = 5;
    this.routes = [];

    this.addRoute = [];
}

MapManager.prototype.initMap = function(origin,destination,zoom){

    var center = this.calcCenterPosition(origin,destination)

    var lat = center.lat;//緯度
    var lng = center.lng;//経度
    this.map = new GMaps({
        div: "#map",//id名
        lat: lat,
        lng: lng,
        zoom: zoom
    })
}

MapManager.prototype.initMapArray = function(lat,lng,zoom){

    this.map = new GMaps({
        div: "#map",//id名
        lat: lat,
        lng: lng,
        mapTypeControl: false,
        scrollwheel: false,
        zoom: zoom,
        styles: [
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#a3ccff"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
    })
}

MapManager.prototype.makeLatLngArr = function(){
    var latArr = []
    var lngArr = []
    for (var i = 0; i < this.routes.length; i++) {
        latArr.push(this.routes[i].lat)
        lngArr.push(this.routes[i].lng)
    }

    var latLngArr = {
        latArr: latArr,
        lngArr: lngArr
    }

    return latLngArr
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

MapManager.prototype.addMarker = function(lat,lng,title,icon,content){
    this.map.addMarker({
        lat: lat,
        lng: lng,
        title: title,
        icon: icon,
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

MapManager.prototype.setRoute = function(id,placeId,placeName,lat,lng){
    var route = {
        id: id,
        placeId: placeId,
        placeName: placeName,
        lat: lat,
        lng: lng
    }
    this.routes.push(route)
}

MapManager.prototype.setRouteShare = function(routeData){
    var route = {
        id: routeData.id,
        placeId: routeData.placeId,
        placeName: routeData.placeName,
        lat: routeData.lat,
        lng: routeData.lng
    }
    this.routes.push(route)
}

MapManager.prototype.removeRoute = function(id){
    var self = this
    var targetId = id;
    self.routes.some(function(v, i){
        if (v.id==targetId) self.routes.splice(i,1);
    });
}

MapManager.prototype.renderRoute = function(){
    var self = this
    this.routes = this.routes.sort()
    this.routes = this.routes.sort(
        function(a,b){
            var aId = a['id'];
            var bId = b['id'];
            if( aId < bId ) return -1;
            if( aId > bId ) return 1;
            return 0;
        }
    )  
    for (var i = 0; i < this.routes.length; i++) {
        if (i == 0) {
            self.drawRoute(
                this.routes[i].lat,
                this.routes[i].lng,
                this.routes[i+1].lat,
                this.routes[i+1].lng
            )
            self.addMarker(this.routes[i].lat,this.routes[i].lng,'title','/images/start.png','content')
            self.addRouteNaviFrom(this.routes[i].placeName)
        }
        else if (i != this.routes.length-1) {
            self.drawRoute(
                this.routes[i].lat,
                this.routes[i].lng,
                this.routes[i+1].lat,
                this.routes[i+1].lng
            )
            self.addMarker(this.routes[i].lat,this.routes[i].lng,'title','/images/via.png','content')
            self.addRouteNaviVia(this.routes[i].placeName)
        }
        else {
            self.addMarker(this.routes[i].lat,this.routes[i].lng,'title','/images/goal.png','content')
            self.addRouteNaviTo(this.routes[i].placeName)
        }
    }
}

MapManager.prototype.setSessionRoutes = function(placeId){
  this.addRoute.push(placeId);
  sessionStorage.setItem('routes',JSON.stringify(this.addRoute));
}

/**
 *  getSessionRoutes
 *  セッションからrouteを取得
 *
 *  @return { array }  routes
 */
MapManager.prototype.getSessionRoutes = function(){
  var routes = JSON.parse(sessionStorage.getItem('routes'))
  if(!routes) routes = [];

  return routes
}

MapManager.prototype.destorySessionRoutes = function(){
  sessionStorage.removeItem('routes')
}

MapManager.prototype.getRoute = function(){
  return this.routes
}

MapManager.prototype.addRouteNaviFrom = function(spotName){
    $('.route-navi').append('<div class="map-spot-title-container"><div class="icon map-spot-from">発</div><div class="map-spot-title first"><img src="/images/start.png"><p>'+spotName+'</p></div></div>')
}

MapManager.prototype.addRouteNaviVia = function(spotName){
    $('.route-navi').append('<div class="map-spot-title-container"><div class="icon map-spot-via"></div><div class="map-spot-title after"><img src="/images/via.png"><p>'+spotName+'</p></div></div>')
}

MapManager.prototype.addRouteNaviTo = function(spotName){
    $('.route-navi').append('<div class="map-spot-title-container"><div class="icon map-spot-to">着</div><div class="map-spot-title after last"><img src="/images/goal.png"><p>'+spotName+'</p></div></div>')
}

window.mapManager = new MapManager()



