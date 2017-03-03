var fs = require("fs")
var express = require('express');
var router = express.Router();
var gma = require("../service/GoogleMapApiService")

const SEARCH_RADIUS = 10;

function responseShopList(res,origin,destination,radius){
	var promiseProcess = gma.init(origin,destination,radius);

	promiseProcess
	.then(function(data){
		var shopListArray = new Array();

		for(var i in data){
			Array.prototype.push.apply(shopListArray,data[i])
		}

		if(shopListArray.length < 10){
			radius += 10;
			responseShopList(res,origin,destination,radius)
		}else{
			res.json({
				shopList: shopListArray
			})
		}

	}).catch(function(err){
		console.log(err)
	})
}

router.get('/', function(req, res) {
	var origin = req.query.origin
	var destination = req.query.destination

	responseShopList(res,origin,destination,SEARCH_RADIUS)

});

router.get("/detail",function(req,res){
	var placeId = req.query.placeid;

	var promiseProcess = gma.getShopDetail(placeId);

	promiseProcess
	.then(function(data){
		res.json({
			shopDetail: data
		})
	})
	.catch(function(err){
		throw new Error(err);
	})

})

router.post("/share",function(req,res){

	var jsonData = req.body.route;
	var uuid = req.body.uuid

	fs.writeFile("store/"+uuid+'.json', JSON.stringify(jsonData, null, '    '));

	res.json({
		write: true
	})

})

module.exports = router;