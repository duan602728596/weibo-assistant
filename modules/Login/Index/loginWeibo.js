/* 微博登陆相关函数 */

/**
 * 验证微博登陆是否需要验证码
 * @param { string } username: 用户名
 */
export function yanzheng(username: string): Promise{
  const su: string = btoa(username);

  return fetch(`https://login.sina.com.cn/sso/prelogin.php?checkpin=1&entry=mweibo&su=${ su }`, {
    method: 'GET'
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 获取验证码
 * @param { string } username: 用户名
 */
export function getCaptcha(username: string): Promise{
  const rnd: number = Math.random();
  const uri: string = 'https://captcha.weibo.com/api/pattern/get?ver=1.0.0&source=ssologin&line=160&side=100&radius=30';

  return fetch(uri + `&usrname=${ username }&_rnd=${ rnd }`, {
    method: 'GET'
  }).then((res: Object): Promise=>{
    return res.text();
  }).then((data: string): Object=>{
    return JSON.parse(data.replace(/[()]/g, ''));
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 验证验证码
 * @param { string } id
 * @param { string } username
 * @param { string } pathEnc
 * @param { string } dataEnc
 */
export function yanzhengCaptcha(id: string, username: string, pathEnc: string, dataEnc: string ): Promise{
  const eId: string = encodeURIComponent(id);
  const eUsername: string = encodeURIComponent(username);
  const ePathEnc: string = encodeURIComponent(pathEnc);
  const eDataEnc: string = encodeURIComponent(dataEnc);
  const uri: string = 'https://captcha.weibo.com/api/pattern/verify?ver=1.0.0&source=ssologin';

  return fetch(uri + `&id=${ eId }&usrname=${ eUsername }&path_enc=${ ePathEnc }&data_enc=${ eDataEnc }`, {
    method: 'GET'
  }).then((res: Object): Promise=>{
    return res.text();
  }).then((data: string): Object=>{
    return JSON.parse(data.replace(/[()]/g, ''));
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 登录微博
 * @param { string } username
 * @param { string } password
 * @param { string } id
 */
export function loginWeibo(username: string, password: string, id: ?string): Promise{
  let data: string = `username=${ username }&password=${ password }`;
  if(id) data += `&vid=${ id }`;

  return fetch('https://passport.weibo.cn/sso/login', {
    method: 'POST',
    headers: {
      Referer: 'https://passport.weibo.cn/signin/login?entry=mweibo&r=http%3A%2F%2Fm.weibo.cn',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  }).catch((err: any): void=>{
    console.error(err);
  });
}
/* =========================== 计算data_enc path_enc =========================== */
/* eslint-disable */
export const pathEncCount = {
  decode:function(a,b){var c=function(b){for(var c,d=a,e=(b[0],b[1]),f=8,g=3;f>4;f--,g--)c=e[g]%f,d=d.substr(0,c)+d.substr(c+1);return d}(function(a){for(var c,d=[],e=[],f=a,g=0;4>g;g++)c=b.charAt(f),e.push(f),d.push(c),f=c.charCodeAt(0)%32;return[d,e]}(3));return function(a){for(var b=[],c=+(!+[]+!0+!0+!0+!0+!0+!0+!0+!0+[]+(!+[]+!0+!0+!0+!0+!0+!0+[])),d=0;d<a.length;d++)b.push(a[d].charCodeAt(0)-c);return b.join("")}(c)},
  encode:function(a,b){for(var c=b.length-2,d=b.slice(c),e=[],f=0;f<d.length;f++){var g=d.charCodeAt(f);e[f]=g>57?g-87:g-48}d=c*e[0]+e[1];var h,i=parseInt(a)+d,j=b.slice(0,c),k=[20,50,200,500],l=[],m={},n=0;f=0;for(var o in k)l.push([]);for(var p=j.length;p>f;f++)h=j.charAt(f),m[h]||(m[h]=1,l[n].push(h),n++,n==l.length&&(n=0));for(var q,r=i,s="",t=k.length-1;r>0&&!(0>t);)r-k[t]>=0?(q=parseInt(Math.random()*l[t].length),s+=l[t][q],r-=k[t]):t-=1;return s}
};

export const dataEncCount = {
  seed:"()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnop~$^!|",
  numberTransfer:function(a){for(var b=this.seed,c=b.substr(0,b.length-3),d=c.length,e=b.substr(-2,1),f=b.substr(-3,1),g=0>a?f:"",a=Math.abs(a),h=parseInt(a/d),i=[a%d];h;)g+=e,i.push(h%d),h=parseInt(h/d);for(var j=i.length-1;j>=0;j--)g+=0==j?c.charAt(i[j]):c.charAt(i[j]-1);return 0>a&&(g=f+g),g},
  arrTransfer:function(a){for(var b=[a[0]],c=0;c<a.length-1;c++){for(var d=[],e=0;e<a[c].length;e++)d.push(a[c+1][e]-a[c][e]);b.push(d)}return b},
  encode:function(a){for(var b=this.seed.substr(-1),c=this.arrTransfer(a),d=[],e=[],f=[],g=0;g<c.length;g++)d.push(this.numberTransfer(c[g][0])),e.push(this.numberTransfer(c[g][1])),f.push(this.numberTransfer(c[g][2]));return d.join("")+b+e.join("")+b+f.join("")}
};
/* eslint-enable */