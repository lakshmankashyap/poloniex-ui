import React from 'react'
import { Route } from 'react-router'
import App from './pages/App'
import Dashboard from './pages/Dashboard'

export default (
  <Route component={App}>
 	 <Route component={Dashboard} path="/" />
  </Route>
);
