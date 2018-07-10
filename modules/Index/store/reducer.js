import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';

const initData: {
  username: string
} = {
  username: ''
};

export const username: Function = createAction('当前选中的登陆的用户');

/* reducer */
const reducer: Function = handleActions({
  [username]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    return $$state.set('username', action.payload.data);
  }
}, fromJS(initData));

export default {
  index: reducer
};