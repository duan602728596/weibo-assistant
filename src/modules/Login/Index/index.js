/* 登录 */
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createSelector, createStructuredSelector } from 'reselect';
import { List, InputItem, Button, Toast } from 'antd-mobile';
import Base64 from 'Base64';
import hint from 'hint';
import style from './style.sass';
import { isPin, getCaptcha, yanzhengCaptcha, login } from '../store/reducer';

const body: Element = document.getElementsByTagName('body')[0];

/* 初始化数据 */
const state: Function = createStructuredSelector({});

/* dispatch */
const dispatch: Function = (dispatch: Function): Object=>({
  action: bindActionCreators({
    isPin,
    getCaptcha,
    yanzhengCaptcha,
    login
  }, dispatch)
});

@withRouter
@connect(state, dispatch)
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
  async login(username: string, password: string, cookie: ?string): Promise<void>{
    try{
      const step4: Object = await this.props.action.login({
        data: `username=${ username }&password=${ password }`,
        headers: {
          cookie: cookie || ''
        }
      });
      if(!(step4 && step4.status === 200)){
        if(cookie)Toast.hide();
        Toast.fail('登录失败', 1.5);
        return void 0;
      }
      const step4Data: Object = JSON.parse(step4.data);
      if(cookie)Toast.hide();
      if(step4Data.retcode === 20000000){
        const cookie: string = step4.xhr.getResponseHeader('set-cookie');
        window.localStorage.setItem('cookie', cookie);
        window.localStorage.setItem('username', username);
        Toast.success('登录成功', 1.5);
        this.props.history.push('/');
      }else{
        Toast.fail(`（${ step4Data.retcode }）${ step4Data.msg }`, 1.5);
      }
    }catch(err){
      console.error(err);
      Toast.fail('登录失败', 1.5);
    }
  }
  // 判断是否需要手势验证
  async yanzheng(username: string, password: string): Promise<void>{
    Toast.loading('登陆中...', 0);
    try{
      // 判断是否需要验证码
      const step1: Object = await this.props.action.isPin({
        pathname: {
          su: Base64.encode(encodeURIComponent(username))
        }
      });
      if(!(step1 && step1.status === 200)){
        Toast.hide();
        Toast.fail('（1）验证失败', 1.5);
        return void 0;
      }
      const step1Data: Object = JSON.parse(step1.data.replace(/\n/g, '\\n'));
      if('showpin' in step1Data && step1Data.showpin === 1){
        // 需要手势验证，获取验证码
        const step2: Object = await this.props.action.getCaptcha({
          pathname: {
            usrname: encodeURIComponent(username),
            rnd: `${ Math.random() }`
          }
        });
        if(!(step2 && step2.status === 200)){
          Toast.hide();
          Toast.fail('获取验证码失败', 1.5);
          return void 0;
        }
        const step2Data: Object = JSON.parse(step2.data.replace(/[()]/g, ''));
        const cookie: string = step2.xhr.getResponseHeader('set-cookie');
        // 验证
        Toast.hide();
        hint(step2Data.path_enc, step2Data.id);
        // 监听回调函数
        const cb: Function = async(event: Event): Promise<void>=>{
          try{
            // 判断验证码是否正确
            const data: Object = event.data;
            const step3: Object = await this.props.action.yanzhengCaptcha({
              pathname: {
                id: encodeURIComponent(step2Data.id),
                usrname: encodeURIComponent(username),
                pathEnc: encodeURIComponent(data.path_enc),
                dataEnc: encodeURIComponent(data.data_enc)
              },
              headers: {
                cookie
              }
            });
            if(!(step3 && step3.status === 200)){
              Toast.fail('验证失败', 1.5);
              document.removeEventListener('weibo-pattlock', cb);
              return void 0;
            }
            const step3Data: Object = JSON.parse(step3.data.replace(/[()]/g, ''));
            if(step3Data.code === '100000'){
              this.login(username, password, cookie);
            }else{
              Toast.fail(`（${ step3Data.code }）${ step3Data.msg }`, 1.5);
            }
            document.removeEventListener('weibo-pattlock', cb);
          }catch(err){
            console.error(err);
            Toast.fail('验证失败', 1.5);
          }
        };
        document.addEventListener('weibo-pattlock', cb, false);
      }else{
        this.login(username, password);
      }
    }catch(err){
      console.error(err);
      Toast.hide();
      Toast.fail('验证失败', 1.5);
    }
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
    this.yanzheng(username, password);
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