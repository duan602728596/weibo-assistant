/* 我 */
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { List, Button, NavBar, Icon } from 'antd-mobile';
import style from './style.sass';

@withRouter
class Index extends Component{
  // 点击返回首页
  onBack(event: Event): void{
    this.props.history.push('/');
  }
  // 退出账号
  onExit(event: Event): void{
    window.localStorage.removeItem('cookie');
    window.localStorage.removeItem('username');
    plus.navigator.removeAllCookie();
    this.props.history.push('/Login');
  }
  render(): Object{
    const username: string = window.localStorage.getItem('username');
    return (
      <Fragment>
        <NavBar mode="dark" icon={ <Icon type="left" /> } onLeftClick={ this.onBack.bind(this) }>我</NavBar>
        <div className={ style.main }>
          <List className={ style.list }>
            <List.Item extra={ username }>账号</List.Item>
            <List.Item extra="0.1.0">版本</List.Item>
          </List>
          <Button className={ style.exit } type="warning" onClick={ this.onExit.bind(this) }>退出账号</Button>
        </div>
      </Fragment>
    );
  }
}

export default Index;