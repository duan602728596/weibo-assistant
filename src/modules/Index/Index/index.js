/* 首页 */
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid } from 'antd-mobile';
import style from './style.sass';

const list: Array<{
  icon: string,
  text: string,
  url: string
}> = [
  {
    icon: require('./pencil.svg'),
    text: '超话签到',
    url: '/ChaohuaCheckin'
  },
  {
    icon: require('./user-tie.svg'),
    text: '我',
    url: '/My'
  }
];

@withRouter
class Index extends Component{
  // 判断local storage里面是否有数据
  UNSAFE_componentWillMount(): void{
    const cookie: ?string = window.localStorage.getItem('cookie');
    const username: ?string = window.localStorage.getItem('username');
    if(!(username && cookie)){
      this.props.history.push('/Login');
    }
  }
  // 点击跳转菜单
  onLink(item: Object, index: number): void{
    this.props.history.push(item.url);
  }
  render(): Object{
    return (
      <Fragment>
        <div className={ style.article }>
          <p className={ style.text }>欢迎使用微博助手。</p>
          <p className={ style.text }>作者：段昊辰</p>
          <p className={ style.text }>如有问题请加QQ：602728596，或发送邮件到邮箱duanhaochen@126.com。</p>
        </div>
        <Grid data={ list } onClick={ this.onLink.bind(this) } />
      </Fragment>
    );
  }
}

export default Index;