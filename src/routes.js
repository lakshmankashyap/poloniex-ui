import React from 'react'
import { Route } from 'react-router'
import Layout from './pages/Layout'
import Home from './pages/Home'

export default (
  <Route component={Layout}>
 	 <Route component={Home} path="/" />
  </Route>
);
