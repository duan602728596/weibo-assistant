import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';
import { request } from '../../../function';

const initData: {
  chaohuaList: Immutable.List
} = {
  chaohuaList: List([])  // 超话列表
};

// 超话列表
export const chaohuaList: Function = createAction('超话签到-超话列表');

// 获取超话列表
export const chaohuaRequest: Function = request({
  url: 'https://m.weibo.cn/api/container/getIndex?containerid=100803_-_page_my_follow_super{{ sinceId }}',
  method: 'GET'
});

// 签到
export const qiandaoRequest: Function = request({
  url: 'https://weibo.com/p/aj/general/button?api=http://i.huati.weibo.com/aj/super/checkin&id={{ containerid }}',
  method: 'GET'
});

/* reducer */
const reducer: Function = handleActions({
  [chaohuaList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    return $$state.set('chaohuaList', List(action.payload.data));
  }
}, fromJS(initData));

export default {
  chaohuaCheckin: reducer
};
