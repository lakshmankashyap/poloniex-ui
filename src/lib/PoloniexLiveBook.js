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
    
    this._initialize();
  }
  _initialize() {
    this.book = new PolonienxBook();
    this._conn = null;
    this._sequence = -1;
    this._queue = [];
    this._connect()
      .then(() => this.getInitialOrderbook())
      .then(() => this._processQueue())
      .then(() => console.log('Queue Loadded -- Streaming Live'));

  }
  _processQueue() {
    return new Promise((resolve) => {
      this._queue = this._queue.filter(q => q.seq > this._sequence);
      while (this._queue.length) {
        let data = this._queue.shift();
        this._handleMarketEvent(data);
      }
      resolve();
    });
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
    return new Promise((resolve) => {
      this._conn = new WebSocket(this.websocketURL);
      this._conn.onopen = e => this._onOpen(e.target);
      this._conn.onmessage = e => this._onMessage(e, resolve);
      this._conn.onclose = console.log;
    });
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
  _onMessage(event, resolve) {
    resolve();
    let data = JSON.parse(event.data);
    switch (data[0]) {
      case 176:
          this._handleMarketEvent(data);
        break;
    }

  }
  _handleMarketEvent(data) {
    this._sequence = data[1];
    // console.log('Processed seq: ' + this._sequence);
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

          // case "t":
          //   args.push({
          //     type: "newTrade",
          //     data: {
          //       tradeID: arg[1],
          //       type: (arg[2] == 1 ? "buy" : "sell"),
          //       rate: arg[3],
          //       amount: arg[4],
          //       total: fix(parseFloat(arg[3]) * parseFloat(arg[4])),
          //       date: timestampToDate(arg[5], true)
          //     }
          //   });
          //   break;
      }
    });
    this.updateBook(this);	
  }
  getState(){
  	return this.book.getState();
  }
  getInitialOrderbook(depth = 1000) {
    let params = {
      command: 'returnOrderBook',
      depth: depth,
    };

    return this._get(params);
  }


}