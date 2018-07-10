import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, WebView, TouchableOpacity } from 'react-native';
import { List, InputItem, Button, Toast } from 'antd-mobile-rn';
import { withRouter } from 'react-router-native';
import { createForm } from 'rc-form';
import style from './style';
import { yanzheng, getCaptcha, yanzhengCaptcha, loginWeibo, pathEncCount, dataEncCount } from './loginWeibo';

@withRouter
@createForm()
class Login extends Component{
  static propTypes: Object = {
    form: PropTypes.object,
    history: PropTypes.object
  };

  touchRef: Object = createRef();
  id: ?string = null;
  pathEnc: ?string = null;
  username: ?string = null;
  password: ?string = null;
  state: {
    isModalDisplay: boolean
  } = {
    isModalDisplay: false  // 手势验证modal是否显示
  };

  // 判断是否需要验证码
  async weiboYanzheng(username: string, password: string): Promise<void>{
    try{
      // 判断是否需要验证码
      const step1: Object = await yanzheng(username);
      const step1Data: Object = await step1.json();

      if(('showpin' in step1Data && step1Data.showpin === 1) || ('smsurl' in step1Data)){
        // 需要验证码
        const data: {
          id: string,
          path_enc: string
        } = await getCaptcha(username);
        this.id = data.id;
        this.pathEnc = data.path_enc;
        this.username = username;
        this.password = password;
        this.setState({
          isModalDisplay: true
        });
      }else{
        // 不需要验证码
        this.weiboLogin();
      }
    }catch(err){
      Toast.fail('登陆失败！', 1.5);
      console.error(err);
    }
  }
  // 登陆事件
  onLogin: Function = (event: Event): void=>{
    this.props.form.validateFields((error: any, value: Object): void=>{
      const usernameValue: string = value?.username || '';
      const passwordValue: string = value?.password || '';
      // 判断是否输入了用户名和密码
      if(/^\s*$/.test(usernameValue)){
        Toast.fail('请输入用户名！');
      }else if(passwordValue === ''){
        Toast.fail('请输入密码！', 1.5);
      }else{
        this.weiboYanzheng(usernameValue, passwordValue);
      }
    });
  };
  // 加载成功
  onWebViewLoad: Function = (event: Event): void=>{
    const js: string = `initLujing('${ this.pathEnc }'); initCanvas(); initFunction();`;
    this.touchRef.current.injectJavaScript(js);
  };
  // 触摸回调事件
  onWebViewMessage: Function = async(event: Event): void=>{
    try{
      const data: {
        trace: Array<number[]>,
        zuobiao: number[]
      } = JSON.parse(event.nativeEvent.data);
      const pathEnc: string = pathEncCount.encode(data.zuobiao.join(''), this.id);
      const dataEnc: string = dataEncCount.encode(data.trace);
      const res: {
        code: string,
        msg: string
      } = await yanzhengCaptcha(this.id, this.username, pathEnc, dataEnc);
      if(res.code === '100000'){
        // 验证成功，登陆
        this.weiboLogin(this.id);
      }else{
        // 验证失败
        Toast.fail(`（${ res.code }）${ res.msg }`, 1.5);
      }
      this.setState({
        isModalDisplay: false
      });
    }catch(err){
      Toast.fail('轨迹验证失败！', 1.5);
      console.error(err);
    }
  };
  // 登陆
  async weiboLogin(id: ?string): Promise<void>{
    try{
      const res: Object = await loginWeibo(this.username, this.password, id);
      const data: Object = await res.json();

      if(data.retcode === 20000000){
        const cookie: string = res.headers.map['set-cookie'];
        Toast.success('登录成功！', 1.5);
        // 存储微博登陆列表
        global['storage'].save({
          key: 'userlist',
          id: this.username,
          data: {
            username: this.username,
            cookie
          },
          expires: null
        });
        // 存储当前选择的用户
        global['storage'].save({
          key: 'user',
          data: {
            username: this.username
          },
          expires: null
        });
        this.props.history.push('/');
      }else{
        Toast.fail(`（${ data.retcode }）${ data.msg }`, 1.5);
      }
    }catch(err){
      Toast.fail('账号登陆失败！', 1.5);
      console.error(err);
    }
  }
  // 关闭弹出层
  onClose: Function = (): void=>{
    this.setState({
      isModalDisplay: false
    });
  };
  render(): React.Element{
    const { getFieldProps }: { getFieldProps: Function } = this.props.form;
    return (
      <Fragment>
        <View style={ style.box }>
          <Image style={ style.head } source={ require('./image/head.jpg') } />
          <List style={ style.list }>
            <InputItem clear={ true } { ...getFieldProps('username') }>用户名：</InputItem>
            <InputItem type="password" clear={ true } { ...getFieldProps('password') }>密码：</InputItem>
          </List>
          <Button style={ style.subBtn } type="primary" onClick={ this.onLogin }>登陆</Button>
        </View>
        { /* 手势验证 */
          do{
            if(this.state.isModalDisplay){
              (
                <View style={ style.shoushiModal }>
                  <Text style={ style.shoushiModalTitle }>请进行手势验证</Text>
                  <TouchableOpacity style={ style.close } activeOpacity={ 0.8 } onPress={ this.onClose }>
                    <Image style={ style.closeIcon } source={ require('./image/close.png') } />
                  </TouchableOpacity>
                  <View style={ style.shoushiBox }>
                    <WebView ref={ this.touchRef }
                      style={ style.huadongView }
                      source={ require('./huadong/huadong.html') }
                      scrollEnabled={ false }
                      onLoad={ this.onWebViewLoad }
                      onMessage={ this.onWebViewMessage }
                    />
                  </View>
                </View>
              );
            }
          }
        }

      </Fragment>
    );
  }
}

export default Login;