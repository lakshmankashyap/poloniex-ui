# Poloniex UI
A simple UI for viewing trade information on the Poloniex exchange.

### Getting started

#### Docker

```
$ docker pull samheutmaker/poloniex-ui:latest
$ docker run -d -p 8080:8080 samheutmaker/poloniex-ui:latest
```
Navigate to ```$(docker-machine ip):8080``` on mac or localhost:8080 on linux to view the UI.

#### Build from source
Requires Yarn, Make, and Node

```
$ git clone 
$ cd poloniex-ui
$ make start
```
This will install dependencies, build Poloniex UI, and start a server. Navigate to localhost:8080 to view the UI.

For development mode, run

```
$ make dev
```
This will watch for changes and rebuild as needed.

### Implementation
Poloniex UI is built using React and Node.js. It uses Express as a server. The build process converts all React pages into static assets, bundles all needed JS, and places them in the `static` directory. I chose this setup as it is simple, allows for super fast development, is SEO friendly, and can easily be extended as projects grow. The client recieves updates from the Poloniex API via WebSockets, and as such React's virtual DOM is ideal for handling continual updates of the DOM that this type of data streaming calls for.

To get realtime information, we use PoloniexClient (```lib/PoloniexClient.js```). Using the provider pattern, we wrap PoloniexClient with PoloniexClientProvider (```components/PoloniexClientProvider```) and pass a React component method as a callback function to be invoked when new events are recieved. We then pass the book as a prop to our main dashboard.


### Design
Poloniex UI features a complete, realtime orderbook of the Poloniex Exchange, as well as realtime trade history. Each of these will update as new orders are placed and new trades completed. Poloniex UI also has a very simple mobile view, allowing for on the go viewing of trading information.




