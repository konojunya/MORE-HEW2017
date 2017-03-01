var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
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
router.get('/spot/detail', function(req, res, next) {
  res.render('spot-detail');
});

module.exports = router;
