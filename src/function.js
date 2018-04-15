/* 公共函数 */

/**
 * 将对象转换成一个数组
 * @param { Object } obj
 * @return { Array }
 */
export function objectToArray(obj: Object): Function[]{
  const arr: Array = [];
  for(const key: string in obj){
    arr.push(obj[key]);
  }
  return arr;
}

/**
 * ajax请求函数
 * @param { string } url             : 请求地址
 * @param { string } method          : 请求方式
 * @param { ?Function } successAction: 成功请求数据后的action
 * @param { Object } defaultHeaders  : 默认的请求头
 */
type requestArg = {
  url: string,
  method: string,
  successAction: ?Function,
  defaultHeaders: Object
};
export function request({ url, method = 'GET', successAction, defaultHeaders = {} }: requestArg): Function{
  /**
   * 异步action
   * @param { ?Object } pathname: 替换模板的对象
   * @data { ?Object } data     : 传递的参数
   * @headers { Object } headers: 请求头
   */
  type actionArg = {
    pathname: ?Object,
    data: string,
    headers: Object
  };
  return function(arg: actionArg): Function{
    const { pathname, data, headers }: actionArg = arg || {};
    // 格式化请求头和请求地址
    // headers
    const headers1: Object = Object.assign({}, defaultHeaders);
    if(headers) Object.assign(headers1, headers);
    // url
    const tpUrl: string = pathname ? templateReplace(url, pathname) : url;
    // dispatch
    return function(dispatch: Function): Promise{
      return new Promise((resolve: Function, reject: Function): void=>{
        // 如果成功，resolve会传出data和status，
        // 否则，会返回undefined
        const xhr: XMLHttpRequest = new plus.net.XMLHttpRequest();
        xhr.open(method, tpUrl);
        // 添加请求头
        for(const key: string in headers1){
          xhr.setRequestHeader(key, headers1[key]);
        }
        xhr.onreadystatechange = (event: Event): void=>{
          if(xhr.readyState === 4){
            resolve({
              status: xhr.status,
              data: xhr.responseText,
              xhr
            });
          }
        };
        xhr.send(data ? data : null);
      }).then((result: Object): Object=>{
        if(successAction) dispatch(successAction(result.data));  // successAction
        return result;
      }).catch((err: any): void=>{
        console.error(method, tpUrl, err);
      });
    };
  };
}

/**
 * 模板替换
 * @param { String } template: 模板
 * @param { Object } data    : 数据
 */
export function templateReplace(template: string, data: Object = {}): string{
  return template.replace(/{{\s*[a-zA-Z0-9_]+\s*}}/g, (text: string): string=>{
    const key: string = text.match(/[a-zA-Z0-9_]+/g)[0];
    return key in data ? data[key] : '';
  });
}