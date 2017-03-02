var express = require('express');
var router = express.Router();
var gma = require("../service/GoogleMapApiService")

router.get('/', function(req, res) {
	var origin = req.query.origin
	var destination = req.query.destination

	var promiseProcess = gma.init(origin,destination);
	promiseProcess.then(function(data){
		var shopListArray = new Array();

		for(var i in data){
			Array.prototype.push.apply(shopListArray,data[i])
		}

		res.json({
			shopList: shopListArray
		})
	})
	promiseProcess.catch(function(err){
		console.log(err)
	})

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

module.exports = router;