var express = require('express');
var router = express.Router();
var gma = require("../service/GoogleMapApiService")

router.get('/', function(req, res) {
	var origin = req.query.origin
	var destination = req.query.destination

	var promiseProcess = gma.init(origin,destination);
	promiseProcess.then(function(data){
		var shopListArray = new Array();

		console.log(data)

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

module.exports = router;