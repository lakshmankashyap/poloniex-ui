// The value at this index incdicates the type of the event
const POLONIEX_EVENT_TYPE = 0;
// The value at this index is the sequence of the event
const POLONIEX_EVENT_SEQUENCE = 1;
// The value at this index is the data for the event
const POLONIEX_EVENT_DATA = 2;

// Poloniex event of type market
const POLONIEX_MARKET_EVENT = 176;
// The value at this index indicates the type of the market event
const POLONIEX_MARKET_EVENT_TYPE = 0;
// Poloniex market event of type inital state
const POLONIEX_MARKET_EVENT_INITAL_STATE = 'i';
// Poloniex market event of type order
const POLONIEX_MARKET_EVENT_ORDER = 'o';
// Poloniex market event of type trade
const POLONIEX_MARKET_EVENT_TRADE = 't';

export {
  POLONIEX_EVENT_TYPE,
  POLONIEX_EVENT_SEQUENCE,
  POLONIEX_EVENT_DATA,
  POLONIEX_MARKET_EVENT,
  POLONIEX_MARKET_EVENT_TYPE,
  POLONIEX_MARKET_EVENT_INITAL_STATE,
  POLONIEX_MARKET_EVENT_ORDER,
  POLONIEX_MARKET_EVENT_TRADE
};
