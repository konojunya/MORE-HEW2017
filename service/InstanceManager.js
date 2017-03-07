function InstanceManager(){

  var self = this;

  this.tokens = [
    "AIzaSyBqLdw_HT4tO8Bfsy9LFJiHeUE7gW9ZfHM",
    "AIzaSyCOutJcsD0eu_9Hya12l0GONYEJecKsL0o",
    "AIzaSyAEwAkLiBjmDYIraPVu780EPooAC5D8DGY",
    "AIzaSyAWZwvZnogxXTN63qgWvvzt3nk-JnlceWY",
    "AIzaSyAWnGsKwffWpM_Ta7VOftZJoj9TFI4nZ7k",
    "AIzaSyAi4VWCTD-MgoNV3JtNZIM_8yYHIZFo5MQ",
    "AIzaSyDJ3iBFHo1WFUi7u6x8CksYwOu-Q4HnZW4",
    "AIzaSyBnvJz7AAmZgMu_mNX7VTQDiQRQV12qzKA",
    "AIzaSyBAl7IZXRfKJqZPTtAtaBWu6LS7i9P-Yl0",
    "AIzaSyDTJaM8PsRUER2vnOZ2rdgV_s8Xk1Db3tQ"
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