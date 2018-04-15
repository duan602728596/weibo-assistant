import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { request } from '../../../function';

const initData: {} = {};

// 判断是否需要验证码验证
export const isPin: Function = request({
  url: 'https://login.sina.com.cn/sso/prelogin.php?checkpin=1&entry=mweibo&su={{ su }}',
  method: 'GET'
});

// 获取验证码
export const getCaptcha: Function = request({
  url: 'https://captcha.weibo.com/api/pattern/get?ver=1.0.0&source=ssologin&usrname={{ usrname }}&line=160&side=100&radius=30&_rnd={{ rnd }}',
  method: 'GET'
});

// 验证验证码
export const yanzhengCaptcha: Function = request({
  url: 'https://captcha.weibo.com/api/pattern/verify?ver=1.0.0&id={{ id }}&usrname={{ usrname }}&source=ssologin&path_enc={{ pathEnc }}&data_enc={{ dataEnc }}',
  method: 'GET'
});

// 登录
export const login: Function = request({
  url: 'https://passport.weibo.cn/sso/login',
  method: 'POST',
  defaultHeaders: {
    Referer: 'https://passport.weibo.cn/signin/login?entry=mweibo&r=http%3A%2F%2Fm.weibo.cn',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

/* reducer */
const reducer: Function = handleActions({}, fromJS(initData));

export default {
  login: reducer
};
