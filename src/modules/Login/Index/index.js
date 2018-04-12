/* 登录 */
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { List, InputItem, Button, Toast } from 'antd-mobile';
import style from './style.sass';

const body: Element = document.getElementsByTagName('body')[0];

@withRouter
class Index extends Component{
  state: {
    username: string,
    password: string
  };

  constructor(): void{
    super(...arguments);

    this.state = {
      username: '',   // 用户名
      password: ''    // 密码
    };
  }
  componentWillMount(): void{
    window.localStorage.removeItem('cookie');
    window.localStorage.removeItem('username');
  }
  // 表单同步
  onInputChange(key: string, value: string): void{
    this.setState({
      [key]: value
    });
  }
  // 登录
  login(username: string, password: string): void{
    const xhr: XMLHttpRequest = new plus.net.XMLHttpRequest();
    xhr.open('POST', 'https://passport.weibo.cn/sso/login');
    xhr.setRequestHeader('Referer', 'https://passport.weibo.cn/signin/login?entry=mweibo&r=http%3A%2F%2Fm.weibo.cn');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = (event: Event): void=>{
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          // 判断是否登录成功
          const result: Object = JSON.parse(xhr.responseText);
          if(result.retcode === 20000000){
            const cookie: string = xhr.getResponseHeader('set-cookie');
            window.localStorage.setItem('cookie', cookie);
            window.localStorage.setItem('username', username);
            Toast.success('登录成功', 1.5);
            this.props.history.push('/');
          }else{
            Toast.fail(`（${ result.retcode }）${ result.msg }`, 1.5);
          }
        }else{
          Toast.fail(`（${ result.retcode }）${ result.msg }`, 1.5);
        }
      }
    };
    xhr.send(`username=${ username }&password=${ password }`);
  }
  // 登录
  onLogin(event: Event): void{
    const { username, password }: {
      username: string,
      password: string
    } = this.state;
    if(/^\s*$/.test(username)){
      Toast.info('请输入用户名！', 1.5);
      return void 0;
    }
    if(password === ''){
      Toast.info('请输入密码！', 1.5);
      return void 0;
    }
    this.login(username, password);
  }
  render(): Object{
    return (
      <Fragment>
        <img className={ style.image } src={ require('./001.jpg') } />
        <p className={ style.text }>微博账号登录。</p>
        <List className={ style.list }>
          <InputItem value={ this.state.username } onChange={ this.onInputChange.bind(this, 'username') }>用户名</InputItem>
          <InputItem type="password" value={ this.state.password } onChange={ this.onInputChange.bind(this, 'password') }>密码</InputItem>
        </List>
        <Button className={ style.btn } type="primary" onClick={ this.onLogin.bind(this) }>登录</Button>
      </Fragment>
    );
  }
}

export default Index;