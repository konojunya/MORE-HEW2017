var fs = require("fs")
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/mypage', function(req, res, next) {
  res.render('mypage');
});
router.get('/spot', function(req, res, next) {
  res.render('spot-list');
});
router.get('/spot/:id', function(req, res, next) {
  res.render('spot-detail');
});
router.get('/confirm', function(req, res, next) {
  res.render('confirm-route-complete');
});
router.get("/share/:id",function(req,res){

	var id = req.params.id

	fs.readdir("store",function(err,files){
		if(err) throw new Error(err);

		var fileCheck = false
		var fileList = []
    var obj = []

		files.filter(function(file){
			return /.*\.json$/.test(file);
		}).forEach(function(file){
			fileList.push(file)
		});

		fileList.map(function(file){
			if(file.replace(/.json$/,"") == id){
				fileCheck = true
        obj = JSON.parse(fs.readFileSync("store/"+file, 'utf8'));
			}
		})
    res.render('share-view',{data: obj});

		if(!fileCheck){
			res.render('not-found')
		}

	})

})

module.exports = router;
