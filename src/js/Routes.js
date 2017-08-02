import React from 'react'
import { Route } from 'react-router'
import App from './App'
import PoloniexDashboard from './pages/PoloniexDashboard'

export default (
  <Route component={App}>
 	 <Route component={PoloniexDashboard} path="/" />
  </Route>
);
