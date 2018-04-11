import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData: {
  chaohuaList: Immutable.List
} = {
  chaohuaList: List([])  // 超话列表
};

// 超话列表
export const chaohuaList: Function = createAction('超话签到-超话列表');

/* reducer */
const reducer: Function = handleActions({
  [chaohuaList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    return $$state.set('chaohuaList', List(action.payload.data));
  }
}, fromJS(initData));

export default {
  chaohuaCheckin: reducer
};
