/* 公共函数 */

/**
 * 将对象转换成一个数组
 * @param { Object } obj
 * @return { Array }
 */
export function objectToArray(obj: Object): Function[]{
  const arr: Function[] = [];
  for(const key: string in obj){
    arr.push(obj[key]);
  }
  return arr;
}