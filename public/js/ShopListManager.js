function ShopListManager(){
	this.place = {
		origin: "",
		destination: ""
	}
	this.shopList = []
	this.isCache = false
}
ShopListManager.prototype.setList = function(shopList){
	sessionStorage.setItem('shopList',JSON.stringify(shopList));
}
ShopListManager.prototype.getList = function(){
	var shopList = sessionStorage.getItem("shopList");
	return JSON.parse(shopList)
}

ShopListManager.prototype.setPlace = function(placeObj){
	sessionStorage.setItem("placeName",JSON.stringify(placeObj))
}
ShopListManager.prototype.getPlace = function(){
	var placeName = sessionStorage.getItem("placeName");
	return JSON.parse(placeName)
}

ShopListManager.prototype.destory = function(){
	sessionStorage.removeItem("shopList")
	sessionStorage.removeItem("placeName")
}

window.shopListManager = new ShopListManager()