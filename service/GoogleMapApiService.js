const key = require("../.key")
const param = require('jquery-param');
const request = require("request");
const async = require('async');
const gm = require('@google/maps').createClient({
  key: key.token
});

let placeNameOrigin = placeNameDestination = null

let searchRadius = null

const PHOTO_MAX_WIDTH = 400;
const SUCCESS_STATUS_CODE = 200;

function GoogleMapApiService(){
	this.key = key.token
	this.travel_mode = {
		walk: "walking",
		drive: "driving"
	}
}

/**
 *	init
 *	最初に実行する関数
 */
GoogleMapApiService.prototype.init = function(origin,destination,radius){
	const self = this

	placeNameOrigin = origin
	placeNameDestination = destination

	searchRadius = radius

	const promiseProcess = new Promise(function(resolve,reject){

		async.series([
			self.getOriginLatlng,
			self.getDestinationLatlng
		],function(err, results){
			if (err) reject(err);
			self.getDirections(resolve,results);
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
GoogleMapApiService.prototype.getShopDetail = function(placeId){

	/**
	 *	photoReferenceToImageUrl
	 *
	 *	@param { string }	photo_reference
	 *	@return { string } url
	 */
	const photoReferenceToImageUrl = function(photo_reference){
		const params = param({
			maxwidth: PHOTO_MAX_WIDTH,
			photoreference: photo_reference,
			key: key.token
		})

		const url = "https://maps.googleapis.com/maps/api/place/photo?"+params

		return url
	}

	const promiseProcess = new Promise(function(resolve,reject){

		const self = this

		const params = param({
			key: key.token,
			placeid: placeId,
			language: "ja"
		})

		const options = {
			url: "https://maps.googleapis.com/maps/api/place/details/json?"+params,
			json: true
		}

		request.get(options,function(err,response,body){
			if(!err && response.statusCode == SUCCESS_STATUS_CODE){
				const results = body.result;
				
				let photosArray = []
				if(results.photos.length > 0){
					results.photos.map(function(photo){
						photosArray.push(photoReferenceToImageUrl(photo.photo_reference))
					})
				}

				const shopDetailObject = {
					name: results.name,
					address: results.vicinity,
					tel: results.formatted_phone_number ? results.formatted_phone_number : null,
					openingHours: results.opening_hours ? results.opening_hours.weekday_text : null,
					rate: results.rating,
					reviews: results.reviews,
					website: results.website ? results.website : null,
					gmapUrl: results.url,
					image: photosArray.length > 0 ? photosArray : []
				}

				resolve(shopDetailObject)

			}
		})

	})

	return promiseProcess

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
	const photoReferenceToImageUrl = function(photo_reference){
		const params = param({
			maxwidth: PHOTO_MAX_WIDTH,
			photoreference: photo_reference,
			key: key.token
		})

		const url = "https://maps.googleapis.com/maps/api/place/photo?"+params

		return url
	}

	const self = this;

	const params = param({
		location: latlng,
		radius: searchRadius,
		types: "food",
		language: "ja",
		key: key.token
	});

	const options = {
		url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"+params,
		json: true
	};

	request.get(options,function(err,response,body){
		if(!err && response.statusCode == SUCCESS_STATUS_CODE){
			let results = []
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
	const self = this

	gm.directions({
		origin: results[0],
		destination: results[1],
		mode: self.travel_mode.walk,
		language: "ja"
	},function(err,response){
		if(err) console.log(err);

		const AsyncGetPlace = {
			getPlace: self.getPlace
		}

		var
			stepsArray = [],
			tmpArray = response.json.routes[0].legs[0].steps;

			for(let i = 0; i < tmpArray.length; i++){
				var ll = tmpArray[i].end_location
				stepsArray.push([ll.lat,ll.lng].join(","))
			}

			async.map(stepsArray,AsyncGetPlace.getPlace,function(err,results){
				if(err) console.log(err);
				console.log(results)
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
	const self = this

	gm.geocode({
		address: placeNameOrigin,
		language: "ja"
	},function(err,response){
		if (err) console.log(err);
		let latlng = response.json.results[0].geometry.location
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
		let latlng = response.json.results[0].geometry.location
		latlng = new Array(latlng.lat,latlng.lng)
		console.log(`[GET] destination: ${latlng}`)
		callback(null,latlng);
	})
}

module.exports = new GoogleMapApiService()