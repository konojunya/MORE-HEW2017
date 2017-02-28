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

async.series([
	getOriginLatlng,
	getDestinationLatlng
],function(err, results){
	if (err) console.log(err);
	getDirections(results)
})

/**/
// getPlace("34.7024854,135.4937619")
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
				console.log(item.name)
			})
		}
	})
}

/*
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

/*
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

/*
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