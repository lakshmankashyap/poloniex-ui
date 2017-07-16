import {
  GET
} from './../util/Request';
import jsonResponse from './../util/JsonResponse'
import PolonienxBook from './../lib/PolonienxBook'
import autobahn from 'autobahn'

export default class PoloniexLiveBook {
  constructor(config) {
    let defaults = {
      currencyPair: 'ETH_REP',
      apiURL: 'https://poloniex.com/public',
      websocketURL: 'wss://api2.poloniex.com/',
      updateBook: () => {}
    };

    config = {
      ...defaults,
      ...config
    };

    this.currencyPair = config.currencyPair;
    this.apiURL = config.apiURL
    this.websocketURL = config.websocketURL;
    this.updateBook = config.updateBook;
    this.book = new PolonienxBook();
    this._conn = null;
    this._sequence = -1;
    this._queue = [];
    this._tradeHistory = [];
    this.loading = false;

    this._initialize();
  }
  _initialize() {
  	this.loading = true;
    this.book = new PolonienxBook();
    this._conn = null;
    this._sequence = -1;
    this._queue = [];
    this._tradeHistory = [];
    this._connect();
    this._loadTradeHistory()
      .then((res) => {
        res.reverse()
          .forEach((trade) => this._updateTradeHistory(trade));
		this.loading = false;         
      })
      .catch((err) => console.error(err));
  }
  _get(params = {}) {
    params = {
      currencyPair: this.currencyPair,
      ...params
    };

    return GET(this.apiURL, params)
      .then(jsonResponse)
      .catch((err) => {
        console.error(err);
      });
  }
  _connect() {
    this._conn = new WebSocket(this.websocketURL);
    this._conn.onopen = e => this._onOpen(e.target);
    this._conn.onmessage = e => this._onMessage(e);
    this._conn.onclose = console.log;
  }
  _subscribe(session, channel) {
    session.send(JSON.stringify({
      command: 'subscribe',
      channel
    }));
  }
  _onOpen(session) {
    this._subscribe(session, this.currencyPair);
  }
  _onMessage(event) {
    let data = JSON.parse(event.data);
    switch (data[0]) {
      case 176:
        this._handleMarketEvent(data);
        break;
    }
  }
  _handleMarketEvent(data) {
    this._sequence = data[1];
    data[2].forEach((arg) => {
      switch (arg[0]) {
        case 'i':
          let orderBook = arg[1].orderBook;
          this.book.setInitialState(orderBook[1], orderBook[0]);
          break;

        case 'o':
          this.book[arg[3] == '0.00000000' ? 'remove' : 'modify']({
            type: (arg[1] == 1 ? "bid" : "ask"),
            rate: arg[2],
            amount: arg[3]
          });
          break;

        case "t":
          console.log(arg);
          this._updateTradeHistory({
            tradeID: arg[1],
            type: (arg[2] == 1 ? "buy" : "sell"),
            rate: arg[3],
            amount: arg[4],
            total: parseFloat(arg[3]) * parseFloat(arg[4]),
            date: arg[5] * 1000
          });
          break;
      }
    });

    this.updateBook(this);
  }
  _loadTradeHistory() {
    let params = {
      command: 'returnTradeHistory',
    };
    return this._get(params);
  }
  _updateTradeHistory(newTrade) {
    this._tradeHistory.unshift(newTrade);
  }
  getState() {
    return this.book.getState();
  }
  getTradeHistory() {
    return this._tradeHistory;
  }
}