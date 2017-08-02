/**
 * Represents a Poloniex order book.
 * @class
 */
export default class PolonienxBook {
  constructor() {
    this._bidsByPrice = {};
    this._asksByPrice = {};
  }
  /**
   * Get the book by type
   * @param {String} type - The type of book to get, ask or bid
   * @returns {Object} The current book of the specified type
   */
  _getHash(type) {
    return type == 'bid' ? this._bidsByPrice : this._asksByPrice;
  }
  /**
   * Get the current the book
   * @returns {Object} The current book
   */
  getState() {
    return {
      asks: this._asksByPrice,
      bids: this._bidsByPrice
    };
  }
    /**
   * Set the initial state of the order books
   * @param {Object} bids - Bids by bid price
   * @param {String} bids[rate].amount - The amount available at this rate
   * @param {Object} asks - Asks by ask price
   * @param {String} asks[rate].amount - The amount available at this rate
   * @returns {Undefined}
   */
  setInitialState(bids, asks) {
    this._bidsByPrice = bids;
    this._asksByPrice = asks;
  }
  /**
   * Change/add an order in the book
   * @param {Object} order - The order
   * @param {String} order.type - The type of order, ask or bid
   * @param {String} order.rate - The rate of the order
   * @param {String} order.amount - The amount of curreny available
   * @returns {Undefined}
   */
  modify(order) {
    let hash = this._getHash(order.type);
    hash[order.rate] = order.amount;
  }
  /**
   * Remove an order from the book
   * @param {Object} order - The order
   * @param {String} order.type - The type of order, ask or bid
   * @param {String} order.rate - The rate of the order
   * @returns {Undefined}
   */
  remove(order) {
    let hash = this._getHash(order.type);
    delete hash[order.rate];
  }
}
