function InstanceManager(){

  var self = this;

  this.tokens = [
    "AIzaSyChf2iU9Y2AqpNjnMlsSGXemXmRg26WWbU",
    "AIzaSyBea9H4jLFHALMMb_ioU-mq0guJhsPQdIg"
  ];

  this.select = 0;

  this.repositories = [];

  this.tokens.map(function(token){
    console.log("CREATE INSTANCE TOKEN IS "+token)
    var instance = require('@google/maps').createClient({
      key: token
    });
    self.repositories.push({
      instance: instance,
      token: token
    })
  })

}

/**
 *  getRepository
 *  インスタンスとトークンをもったObjectを取得する
 *
 *  @return { object } repository
 */
InstanceManager.prototype.getRepository = function(){
  var repository = this.repositories[this.select%this.repositories.length];
  this.select++;
  return repository;
}

module.exports = new InstanceManager();