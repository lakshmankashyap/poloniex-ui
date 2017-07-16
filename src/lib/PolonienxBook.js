export default class PolonienxBook {
  constructor() {
    this._bidsByPrice = {};
    this._asksByPrice = {};
  }
  _getHash(type) {
    return type == 'bid' ? this._bidsByPrice : this._asksByPrice;
  }
  getState(){
  	return {
  		asks: this._asksByPrice,
  		bids: this._bidsByPrice
  	};
  }
  setInitialState(bids, asks) {
    this._bidsByPrice = bids;
    this._asksByPrice = asks;
  }
  modify(newOrder) {
    let hash = this._getHash(newOrder.type);
    hash[newOrder.rate] = newOrder.amount;
  }
  remove(order) {
    let hash = this._getHash(order.type);
    delete hash[order.rate];
  }
}