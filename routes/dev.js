const fs = require("fs")
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {

  fs.readdir("db",function(err,files){
    if(err) throw new Error(err);

    var fileCheck = false;
    var fileList = [];

    files.filter(function(file){
      return /.*\.json$/.test(file);
    }).forEach(function(file){
      fileList.push(file);
    });

    fileList.map(function(file){
      if(file.replace(/.json$/,"") == "list"){
        fileCheck = true;
        var obj = JSON.parse(fs.readFileSync("db/"+file, 'utf8'));
        res.json(obj)
      }
    })

    if(!fileCheck){
      res.json({ routes: "" })
    }

  });

});

router.get("/detail",function(req,res){

  fs.readdir("db",function(err,files){
    if(err) throw new Error(err);

    var fileCheck = false;
    var fileList = [];

    files.filter(function(file){
      return /.*\.json$/.test(file);
    }).forEach(function(file){
      fileList.push(file);
    });

    fileList.map(function(file){
      if(file.replace(/.json$/,"") == "detail"){
        fileCheck = true;
        var obj = JSON.parse(fs.readFileSync("db/"+file, 'utf8'));
        res.json(obj)
      }
    })

    if(!fileCheck){
      res.json({ routes: "" })
    }

  });

});

router.post("/mypage/shops",function(req,res){
  const placeObj = req.body;
  var array = Object.keys(placeObj);

  const promiseProcess = gma.getMypageShopData(array);

  promiseProcess
  .then(function(data){
    res.json({
      shops: data
    })
  })
  .catch(function(err){
    console.log(err);
  })

})

router.post("/route/save",function(req,res){

  const jsonData = req.body.routes;
  const userName = req.body.userId;

  var id = (Date.now()+Math.floor(Math.random()*999999)).toString(36);
  var routeId = userName+"-"+id;

  fs.writeFile("users/"+routeId+'.json', JSON.stringify(jsonData, null, '    '));

  res.json({ routeId: routeId });

});

router.get("/route/read",function(req,res){

  var id = req.query.routeId;

  fs.readdir("users",function(err,files){
    if(err) throw new Error(err);

    var fileCheck = false;
    var fileList = [];

    files.filter(function(file){
      return /.*\.json$/.test(file);
    }).forEach(function(file){
      fileList.push(file);
    });

    fileList.map(function(file){
      if(file.replace(/.json$/,"") == id){
        fileCheck = true;
        var obj = JSON.parse(fs.readFileSync("users/"+file, 'utf8'));
        res.json(JSON.parse(obj))
      }
    })

    if(!fileCheck){
      res.json({ routes: "" })
    }

  });

});

router.post("/share",function(req,res){

  const jsonData = req.body.route;
  const uuid = req.body.uuid;

  fs.writeFile("store/"+uuid+'.json', JSON.stringify(jsonData, null, '    '));

  res.json({
    uuid: uuid
  })

})

module.exports = router;