import jsonResponse from './../util/JsonResponse'
import { GET } from './../util/Request'
import PolonienxBook from './PoloniexBook'
import { timestampToDate } from './PoloniexUtil'
import {
  POLONIEX_EVENT_TYPE,
  POLONIEX_EVENT_SEQUENCE,
  POLONIEX_EVENT_DATA,
  POLONIEX_MARKET_EVENT,
  POLONIEX_MARKET_EVENT_TYPE,
  POLONIEX_MARKET_EVENT_INITAL_STATE,
  POLONIEX_MARKET_EVENT_ORDER,
  POLONIEX_MARKET_EVENT_TRADE
} from './PoloniexConstants'

const DEFAULT_CONFIG = {
  currencyPair: 'ETH_REP',
  apiURL: 'https://poloniex.com/public',
  websocketURL: 'wss://api2.poloniex.com/',
  handleMessage: () => {},
  handleError: () => {}
};

/** The Poloniex client provides realtime
 * data describing trade history and ask/bid prices
 * of the Poloniex exchange
 * @class
 */
export default class PoloniexClient {
  constructor(config = {}) {
    // Merge config and the default config
    // to override defaults with provided values
    config = {
      ...DEFAULT_CONFIG,
      ...config
    };

    this.currencyPair = config.currencyPair;
    this.apiURL = config.apiURL
    this.websocketURL = config.websocketURL;
    this.handleMessage = config.handleMessage;
    this.handleError = config.handleError;
    this.book = new PolonienxBook();
    this.loading = false;
    // The websocket connection
    this._conn = null;
    // Initialized to -1 to indicate that 
    // no events have been received
    this._sequence = -1;
    this._queue = [];
    this._tradeHistory = [];

    this._initialize();
  }
  /**
   * Initialize the client. This method sets all client properties
   * to their defaults and attempts to load the Poloniex trade 
   * history and connect to the WebSocket API. This is done in 
   * a method seperate from the constructor to allow the object
   * to reinitialize itself.
   * @returns {Undefined}
   */
  _initialize() {
    this.loading = true;
    this.book = new PolonienxBook();
    this._conn = null;
    this._sequence = -1;
    this._queue = [];
    this._tradeHistory = [];
    this._connect();
    this._loadTradeHistory()
      .then(res => {
        if(!Array.isArray(res)) {
          throw new Error(res.error);
          return;

        } 

        res.reverse().forEach(trade => this._updateTradeHistory(trade));
        this.loading = false;  
        
      })
      .catch(err => this.handleError(err));
  }
  /**
   * Make an HTTP GET request to the Poloniex API
   * @param {Object} queryParams - The request querystring parameters
   * @returns {Promise}
   */
  _get(queryParams = {}) {
    queryParams = {
      currencyPair: this.currencyPair,
      ...queryParams
    };

    return GET(this.apiURL, queryParams)
      .then(jsonResponse);
  }
  /**
   * Connect to the Poloniex WebSocket API and register callbacks
   * @returns {Undefined}
   */
  _connect() {
    this._conn = new WebSocket(this.websocketURL);
    this._conn.onopen = e => this._subscribe(e.target, this.currencyPair);
    this._conn.onmessage = e => this._onMessage(e);
    this._conn.onclose = console.log;
  }
  /**
   * Subscribe to a WebSocket channel
   * @param {Object} session - The WebSocket session
   * @param {String} channel - The channel to subscribe to
   * @returns {Undefined}
   */
  _subscribe(session, channel) {
    session.send(JSON.stringify({
      command: 'subscribe',
      channel
    }));
  }
  /**
   * Handle a Polonidex WebSocket API event
   * @param {Object} event -  The event
   * @returns {Undefined}
   */
  _onMessage(event) {
    event = JSON.parse(event.data);
    switch (event[POLONIEX_EVENT_TYPE]) { 

      case POLONIEX_MARKET_EVENT:
        this._handleMarketEvent(event);
        // Invoke callback after event has processed
        this.handleMessage(this);
        break;

      default:
        // Ignore non market events
    }
  }
  // Needs comment
  _handleMarketEvent(event) {
    this._sequence = event[POLONIEX_EVENT_SEQUENCE];
    event[POLONIEX_EVENT_DATA].forEach(data => {
      switch (data[POLONIEX_MARKET_EVENT_TYPE]) {

        case POLONIEX_MARKET_EVENT_INITAL_STATE:
          let orderBook = data[1].orderBook;
          this.book.setInitialState(orderBook[1], orderBook[0]);
          break;

        case POLONIEX_MARKET_EVENT_ORDER:
          this.book[data[3] == '0.00000000' ? 'remove' : 'modify']({
            type: (data[1] == 1 ? "bid" : "ask"),
            rate: data[2],
            amount: data[3]
          });
          break;

        case POLONIEX_MARKET_EVENT_TRADE:
          this._updateTradeHistory({
            tradeID: data[1],
            type: (data[2] == 1 ? "buy" : "sell"),
            rate: data[3],
            amount: data[4],
            total: parseFloat(data[3]) * parseFloat(data[4]),
            date: timestampToDate(data[5], true)

          });
          break;

        default:
          // Ignore all other market event types
      }
    });
  }
   /**
   * Retrieves 200 most recent trades on Poloniex
   * @returns {Promise}
   */
  _loadTradeHistory() {
    let params = {
      command: 'returnTradeHistory',
    };
    return this._get(params);
  }
  /**
   * Adds a trade to the trade history
   * @returns {Promise}
   */
  _updateTradeHistory(newTrade) {
    this._tradeHistory.unshift(newTrade);
  }
  /**
   * Returns the current state of the bids and ask books
   * @returns {Object} An object containing bids and asks
   */
  getState() {
    return this.book.getState();
  }
  /**
   * Returns the current trade history
   * @returns {Object} The trade history
   */
  getTradeHistory() {
    return this._tradeHistory;
  }
}