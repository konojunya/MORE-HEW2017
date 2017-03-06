function InstanceManager(){

  var self = this;

  this.tokens = [
    "AIzaSyDhQ8B0YVVulhZnqE-YQmLbkQmEsfLEmEc",
    "AIzaSyBI_pc9oRoG3XeVhqDmwGvxfcWVD2zyfjI",
    "AIzaSyCYOaGay2t6nyg0IN5VN9N1nvo4RlMSy9E",
    "AIzaSyCTwgNdzXcJcIqjN7AIZ-3SR90kPyKAXA0",
    "AIzaSyCP8MtiFScWqq1SsGcbWMisFv6YHpy0oH0",
    "AIzaSyBrJj5uP46yt89zo2eZ18DCmEYBhc4rbww",
    "AIzaSyAfjVd_1jLeojzli5a5A8euN2Pe1kO4euo",
    "AIzaSyALFJwn1dGUHcTgL1ACh_n1TuIfx0HkK3M",
    "AIzaSyAfjVd_1jLeojzli5a5A8euN2Pe1kO4euo",
    "AIzaSyBO7bStAAZkviDTPNesjhoJMFITk8u6lZg",
    "AIzaSyAi2LsBm-rhr4m0D4yZLZUUS0sMX_9qI_o",
    "AIzaSyCL216rW4db6SLeue9ZhTQrrBb1tD6K8w0",
    "AIzaSyAeWZ8CgAe_mkdogNik7mmh8T5wxYhFR2E",
    "AIzaSyATOzV3-r2qlJMlCq5T46zLPwE9gKVps5k"
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