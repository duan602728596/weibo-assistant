/* 全局的store */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Map } from 'immutable';
import { createReducer } from './reducers';

/* reducer列表 */
const reducer: Function = createReducer();

/* initialState */
const $$initialState: Immutable.Map = Map();

/* 中间件 */
const middlewares: Function = applyMiddleware(thunk);

/* store */
const store: Object = createStore(reducer, $$initialState, compose(middlewares));

export default store;