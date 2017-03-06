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
    this.girlFriends[love] = true;

    this.deposit()
  }

  /**
   *  takeLove
   *  愛をいただく（loveをゲットする）
   *
   *  @return { array } girlFirends
   */
  LoveForEver.prototype.takeLove = function(){
    return this.girlFriends;
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
      if(this.girlFriends[girl]){
        array.push(girl)
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
    this.girlFriends[love] = false

    this.deposit()
  }

  global.loveForEver = new LoveForEver();

})(window);