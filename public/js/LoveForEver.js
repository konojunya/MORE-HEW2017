(function(global){

  function LoveForEver(){
    this.girlFriends = {}
  }

  /**
   *  deposit
   *  愛をローカルストレージに預ける
   */
  LoveForEver.prototype.deposit = function(){
    localStorage.setItem("girlFriends",JSON.stringify(this.girlFriends));
  }

  /**
   *  receive
   *  愛をローカルストレージから受け取る
   *
   *  @return { object } gf
   */
  LoveForEver.prototype.receive = function(){
    var gf = localStorage.getItem("girlFriends");
    gf = JSON.parse(gf);
    if(!gf) gf = {}

    return gf
  }

  /**
   *  confession
   *  告白（真実の愛をセットする）
   *
   *  @param { string } love
   */
  LoveForEver.prototype.confession = function(love){
    var gf = this.receive()

    this.girlFriends = gf;
    love.isLove = true
    this.girlFriends[love.id] = love;

    this.deposit()
  }

  /**
   *  checkYourLove
   *  愛しているか確認する
   *
   *  @return { boolean } isLove
   */
  LoveForEver.prototype.checkYourLove = function(id){
    var gf = this.receive()

    var isLove = false
    var gfArray = Object.keys(gf);
    gfArray.map(function(love){
      if(love == id) isLove = true
    })
    return isLove
  }

  /**
   *  giveMeTrueLove
   *  真実の愛だけを返す
   * 
   *  @return { array } array
   */
  LoveForEver.prototype.giveMeTrueLove = function(){
    var array = []
    var gf = this.receive()

    this.girlFriends = gf;

    for(var girl in this.girlFriends){
      if(this.girlFriends[girl].isLove){
        array.push(this.girlFriends[girl])
      }
    }

    return array
  }

  /**
   *  brokenHeart
   *  失恋（真実の愛ではなかった）
   *
   *  @param { string } love
   */
  LoveForEver.prototype.brokenHeart = function(love){
    var gf = this.receive()

    this.girlFriends = gf;
    love.isLove = false
    this.girlFriends[love.id] = love

    this.deposit()
  }

  global.loveForEver = new LoveForEver();

})(window);