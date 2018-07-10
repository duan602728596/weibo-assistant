import React, { Component } from 'react';
import { Route, Switch } from 'react-router-native';
import Index from '../modules/Index/Layout';
import Login from '../modules/Login/Layout';

class Routers extends Component{
  render(): React.Element{
    return (
      <Switch>
        <Route path="/" component={ Index } exact={ true } />
        <Route path="/Login" component={ Login } />
      </Switch>
    );
  }
}

export default Routers;