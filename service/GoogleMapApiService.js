var param = require('jquery-param');
var request = require("request");
var async = require('async');
var gm = require('@google/maps').createClient({
  key: process.env.GMAP_API_KEY
});

var promiseProcess = null;
var placeNameOrigin = placeNameDestination = null

function GoogleMapApiService(){
	this.key = process.env.GMAP_API_KEY
	this.travel_mode = {
		walk: "walking",
		drive: "driving"
	}
}

/**
 *	init
 *	最初に実行する関数
 */
GoogleMapApiService.prototype.init = function(origin,destination){
	var self = this

	placeNameOrigin = origin
	placeNameDestination = destination

	promiseProcess = new Promise(function(resolve,reject){

		async.series([
			self.getOriginLatlng,
			self.getDestinationLatlng
		],function(err, results){
			if (err) reject(err);
			setTimeout(function(){
				self.getDirections(resolve,results);
			},10)
		})

	})

	return promiseProcess
}

/**
 *	getShopDetail
 *	お店の詳細画面を取得
 *
 *	@param { string } placeId
 */
GoogleMapApiService.prototype.getShopDetail = function(){

	var self = this

	var params = param({
		key: process.env.GMAP_API_KEY,
		placeid: placeId,
		language: "ja"
	})

	var options = {
		url: "https://maps.googleapis.com/maps/api/place/details/json?"+params,
		json: true
	}

	request.get(options,function(err,response,body){
		if(!err && response.statusCode == 200){
			var results = body.result

			console.log("店名:\t\t\t"+results.name);
			console.log("住所:\t\t\t"+results.vicinity);
			console.log("電話:\t\t\t"+results.formatted_phone_number);
			console.log("\n営業時間:\t\t"+results.opening_hours.weekday_text);
			console.log("\nレート:\t\t\t"+results.rating);
			console.log("\nreviews:\t\t"+results.reviews);
			console.log("\nwebsite:\t\t"+results.website);
			console.log("\ngoogle mapでのURL:\t"+results.url);
			if(results.photos) console.log("\nお店の写真:\t\t"+self.photoReferenceToImageUrl(results.photos[0].photo_reference));

		}
	})
}

/**
 *	getPlace
 *	位置情報からお店の情報を取得する
 *
 *	@param { string } latlng
 */
GoogleMapApiService.prototype.getPlace = function(latlng,callback){

	/**
	 *	photoReferenceToImageUrl
	 *
	 *	@param { string }	photo_reference
	 *	@return { string } url
	 */
	var photoReferenceToImageUrl = function(photo_reference){
		var params = param({
			maxwidth: 400,
			photoreference: photo_reference,
			key: process.env.GMAP_API_KEY
		})

		var url = "https://maps.googleapis.com/maps/api/place/photo?"+params

		return url
	}

	var self = this;

	var params = param({
		location: latlng,
		radius: 200,
		types: "food",
		language: "ja",
		key: process.env.GMAP_API_KEY
	});

	var options = {
		url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"+params,
		json: true
	};

	request.get(options,function(err,response,body){
		if(!err && response.statusCode == 200){
			var results = []
			body.results.map(function(item){
				if(item.rating && item.photos && item.opening_hours){

					results.push({
						shopName: item.name,
						rating: item.rating,
						placeId: item.place_id,
						image: photoReferenceToImageUrl(item.photos[0].photo_reference),
						openNow: item.opening_hours.open_now,
						genre: "food"
					})

				}
			})

			callback(null,results)

		}
	})
}

/**
 *	getDirections
 *	二点間の情報を取得
 *
 *	@param { array } results
 */
GoogleMapApiService.prototype.getDirections = function(resolve,results){
	var self = this

	gm.directions({
		origin: results[0],
		destination: results[1],
		mode: self.travel_mode.walk,
		language: "ja"
	},function(err,response){
		if(err) console.log(err);

		var AsyncGetPlace = {
			getPlace: self.getPlace
		}

		var
			stepsArray = [],
			tmpArray = response.json.routes[0].legs[0].steps
			for(var i = 0; i < tmpArray.length; i++){
				var ll = tmpArray[i].end_location
				stepsArray.push([ll.lat,ll.lng].join(","))
			}

			async.map(stepsArray,AsyncGetPlace.getPlace,function(err,results){
				if(err) console.log(err);
				resolve(results)
			})
	})
}

/**
 *	getOriginLatlng
 *	出発地点の位置情報
 *
 *	@param { function } callback 
 */
GoogleMapApiService.prototype.getOriginLatlng = function(callback){
	var self = this

	gm.geocode({
		address: placeNameOrigin,
		language: "ja"
	},function(err,response){
		if (err) console.log(err);
		var latlng = response.json.results[0].geometry.location
		latlng = new Array(latlng.lat,latlng.lng)
		console.log(`[GET] origin: ${latlng}`)
		callback(null,latlng);
	})
}

/**
 *	getDestinationLatlng
 *	目的地点の位置情報
 *
 *	@param { function } callback 
 */
GoogleMapApiService.prototype.getDestinationLatlng = function(callback){
	var self = this

	gm.geocode({
		address: placeNameDestination,
		language: "ja"
	},function(err,response){
		if (err) console.log(err);
		var latlng = response.json.results[0].geometry.location
		latlng = new Array(latlng.lat,latlng.lng)
		console.log(`[GET] destination: ${latlng}`)
		callback(null,latlng);
	})
}

module.exports = new GoogleMapApiService()