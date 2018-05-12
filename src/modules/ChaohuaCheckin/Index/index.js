/* 自动签到 */
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createSelector, createStructuredSelector } from 'reselect';
import { NavBar, Icon, Button, List, Toast } from 'antd-mobile';
import style from './style.sass';
import { chaohuaList, chaohuaRequest, qiandaoRequest } from '../store/reducer';

/* 初始化数据 */
const state: Function = createStructuredSelector({
  chaohuaList: createSelector(         // 超话列表
    ($$state: Immutable.Map): ?Immutable.Map => $$state.has('chaohuaCheckin') ? $$state.get('chaohuaCheckin') : null,
    ($$data: ?Immutable.Map): ?Object => $$data !== null ? $$data.get('chaohuaList').toJS() : []
  )
});

/* dispatch */
const dispatch: Function = (dispatch: Function): Object=>({
  action: bindActionCreators({
    chaohuaList,
    chaohuaRequest,
    qiandaoRequest
  }, dispatch)
});

@withRouter
@connect(state, dispatch)
class Index extends Component{
  // 解析超话数据
  chaohuaListData(rawArray: Array): Array{
    const list: [] = [];
    rawArray.forEach((value: Object, index: number, arr: []): void=>{
      if(value.card_type === 8){
        const s: string = value.scheme.match(/containerid=[a-zA-Z0-9]+/)[0];
        const containerid: string = s.split('=')[1];
        list.push({
          pic: value.pic,
          title_sub: value.title_sub,
          containerid,
          status: null,     // 签到状态，0：已签到，1：签到成功
          text: null        // 文字
        });
      }
    });
    return list;
  }
  // 点击加载超话
  async onLoadChaohuaList(): Promise<void>{
    const cookie: string = window.localStorage.getItem('cookie');
    try{
      // 加载超话
      Toast.loading('获取超级话题列表...', 0);
      let list: Array = [];
      let sinceId: ?string = null;
      let isBreak: ?boolean = true;
      while(isBreak){
        const step1: Object = await this.props.action.chaohuaRequest({
          pathname: {
            sinceId: `&since_id=${ encodeURIComponent(sinceId) }`
          },
          headers: {
            Cookie: cookie
          }
        });
        const rl: Object = JSON.parse(step1.data);
        const cardlistInfo: Object = rl.data.cardlistInfo;
        const card_group: Object = rl.data.cards[0].card_group;
        list = list.concat(this.chaohuaListData(card_group)); // 循环card_group，提取数据
        if('since_id' in cardlistInfo){
          sinceId = cardlistInfo.since_id;
        }else{
          isBreak = false;
        }
      }
      this.props.action.chaohuaList({
        data: list
      });

      // 签到
      Toast.loading('签到中...', 0);
      const chaohuaList: Array = this.props.chaohuaList;
      for(let i: number = 0, j: number = chaohuaList.length; i < j; i++){
        const item: Object = chaohuaList[i];
        const res2: Object = await this.props.action.qiandaoRequest({
          pathname: {
            containerid: item.containerid
          },
          headers: {
            Cookie: cookie
          }
        });
        const res: Object = JSON.parse(res2.data);
        if(res.code === '100000'){
          // 签到成功
          item.status = 1;
          item.text = res.code;  // res.data.alert_title;
        }else{
          // 其他情况
          item.status = 0;
          item.text = res.code;  // res.msg;
        }
      }
      this.props.action.chaohuaList({
        data: chaohuaList
      });
      Toast.hide();
    }catch(err){
      console.error(err);
      Toast.hide();
      Toast.fail('超话签到失败！', 1.5);
    }
  }
  // 超话列表
  chaohuaListView(): Array{
    return this.props.chaohuaList.map((item: Object, index: number): Object=>{
      let extra: Object = <span>签到中...</span>;
      if(item.status === 0){
        extra = <span className={ style.isCheckin }>{ item.text }</span>;
      }else if(item.status === 1){
        extra = <span className={ style.success }>{ item.text }</span>;
      }
      return (
        <List.Item key={ item.containerid } thumb={ <img className={ style.pic } src={ item.pic } /> }>
          { item.title_sub }
          <List.Item.Brief>{ extra }</List.Item.Brief>
        </List.Item>
      );
    });
  }
  // 点击返回首页
  onBack(event: Event): void{
    this.props.history.push('/');
  }
  render(): Object{
    return (
      <Fragment>
        <NavBar mode="dark" icon={ <Icon type="left" /> } onLeftClick={ this.onBack.bind(this) }>超话签到</NavBar>
        <Button className={ style.btn } onClick={ this.onLoadChaohuaList.bind(this) }>开始自动签到</Button>
        {
          /* 渲染超话列表 */
          do{
            if(this.props.chaohuaList.length > 0){
              <List>{ this.chaohuaListView() }</List>;
            }else{
              null;
            }
          }
        }
      </Fragment>
    );
  }
}

export default Index;