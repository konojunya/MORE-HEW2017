var param = require('jquery-param');
var request = require("request")
var async = require('async');
var gm = require('@google/maps').createClient({
  key: process.env.GMAP_API_KEY
});

const ORIGIN_PLACE_NAME = "河原町駅"
const DESTINATION_PLACE_NAME = "清水寺"

const TRAVEL_MODE = {
	walk: "walking",
	drive: "driving"
}

// getShopDetail("ChIJ0-fSWJLmAGARZzD3uLdix6U")
// getPlace("34.7024854,135.4937619")


/**
 *	init
 *	最初に実行する関数
 */
function init(){
	async.series([
		getOriginLatlng,
		getDestinationLatlng
	],function(err, results){
		if (err) console.log(err);
		getDirections(results)
	})
}

/**
 *	getShopDetail
 *	お店の詳細画面を取得
 *
 *	@param { string } placeId
 */
function getShopDetail(placeId){
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

			console.log("店名:\t\t\t"+results.name)
			console.log("住所:\t\t\t"+results.vicinity)
			console.log("電話:\t\t\t"+results.formatted_phone_number)
			console.log("\n営業時間:\t\t"+results.opening_hours.weekday_text)
			console.log("\nレート:\t\t\t"+results.rating)
			console.log("\nreviews:\t\t"+results.reviews)
			console.log("\nwebsite:\t\t"+results.website)
			console.log("\ngoogle mapでのURL:\t"+results.url)
			if(results.photos) console.log("\nお店の写真:\t\t"+photoReferenceToImageUrl(results.photos[0].photo_reference))

		}
	})
}

/**
 *	photoReferenceToImageUrl
 *
 *	@param { string }	photo_reference
 *	@return { string } url
 */
function photoReferenceToImageUrl(photo_reference){
	var params = param({
		maxwidth: 400,
		photoreference: photo_reference,
		key: process.env.GMAP_API_KEY
	})

	var url = "https://maps.googleapis.com/maps/api/place/photo?"+params

	return url
}

/**
 *	getPlace
 *	位置情報からお店の情報を取得する
 *
 *	@param { string } latlng
 */
function getPlace(latlng){
	var params = param({
		location: latlng,
		radius: 500,
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
			body.results.map(function(item){
				console.log("店名:\t\t\t"+item.name);
				if(item.rating) console.log("レート:\t\t\t"+item.rating);
				console.log("placeId:\t\t"+item.place_id);
				if(item.photos) console.log("お店の写真:\t\t"+photoReferenceToImageUrl(item.photos[0].photo_reference));
				if(item.opening_hours) console.log("営業時間内かどうか:\t\t"+item.opening_hours.open_now);
				console.log("\n==========================================================================\n");
			})
		}
	})
}

/**
 *	getDirections
 *	二点間の情報を取得
 *
 *	@param { array } results
 */
function getDirections(results){
	gm.directions({
		origin: results[0],
		destination: results[1],
		mode: TRAVEL_MODE.walk,
		language: "ja"
	},function(err,response){
		if(err) console.log(err);

		var stepsArray = response.json.routes[0].legs[0].steps
		for(var i = 0; i < stepsArray.length; i++){
			var ll = stepsArray[i].end_location
			getPlace([ll.lat,ll.lng].join(","))
		}
	})
}

/**
 *	getOriginLatlng
 *	出発地点の位置情報
 *
 *	@param { function } callback 
 */
function getOriginLatlng(callback){
	gm.geocode({
		address: ORIGIN_PLACE_NAME,
		language: "ja"
	},function(err,response){
		if (err) console.log(err);
		var latlng = response.json.results[0].geometry.location
		latlng = new Array(latlng.lat,latlng.lng)
		callback(null,latlng);
	})
}

/**
 *	getDestinationLatlng
 *	目的地点の位置情報
 *
 *	@param { function } callback 
 */
function getDestinationLatlng(callback){
	gm.geocode({
		address: DESTINATION_PLACE_NAME,
		language: "ja"
	},function(err,response){
		if (err) console.log(err);
		var latlng = response.json.results[0].geometry.location
		latlng = new Array(latlng.lat,latlng.lng)
		callback(null,latlng);
	})
}