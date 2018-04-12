import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../modules/Index/Layout';
import Login from '../modules/Login/Layout';
import ChaohuaCheckin from 'bundle-loader?name=chaohua_checkin!../modules/ChaohuaCheckin/Layout';
import My from 'bundle-loader?name=my!../modules/My/Layout';

const ChaohuaCheckinBundle: Function = asyncModule(ChaohuaCheckin);
const MyBundle: Function = asyncModule(My);

/* 路由模块 */
class Router extends Component{
  render(): Object{
    return (
      <Switch>
        {/* 首页 */}
        <Route path="/" component={ Index } exact={ true } />
        {/* 登录 */}
        <Route path="/Login" component={ Login } />
        {/* 超话签到 */}
        <Route path="/ChaohuaCheckin" component={ ChaohuaCheckinBundle } />
        {/* 我 */}
        <Route path="/My" component={ MyBundle } />
      </Switch>
    );
  }
}

export default Router;