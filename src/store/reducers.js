/* reducers */
import { combineReducers } from 'redux-immutable';
import loginReducer from '../modules/Login/store/reducer';

const reducers: Object = {
  ...loginReducer
};

/* 创建reducer */
export function createReducer(asyncReducers: Object): Function{
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}