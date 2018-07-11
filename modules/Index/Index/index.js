import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Image, Text, View } from 'react-native';
import { withRouter } from 'react-router-native';
import { Grid, Card, WingBlank, Button } from 'antd-mobile-rn';
import style from './style';
import { username } from '../store/reducer';
import { USER } from '../../../components/storage/key';

/* 初始化数据 */
const state: Function = createStructuredSelector({
  username: createSelector(    // 当前选中的登陆的用户
    ($$state: Immutable.Map): Immutable.Map => $$state.get('index'),
    ($$data: Immutable.Map): string => $$data.get('username')
  )
});

/* dispatch */
const dispatch: Function = (dispatch: Function): Object=>({
  action: bindActionCreators({
    username
  }, dispatch)
});

@withRouter
@connect(state, dispatch)
class Index extends Component{
  static propTypes = {
    username: PropTypes.string,
    action: PropTypes.objectOf(PropTypes.func),
    history: PropTypes.object
  };

  async componentDidMount(): void{
    try{
      // 判断当前登陆的用户
      const data: Object = await global['storage'].load({
        key: USER
      });
      if(data === null){
        this.props.history.push('/Login');
      }else{
        this.props.action.username({
          data: data.username
        });
      }
    }catch(err){
      console.error(err);
    }
  }
  // 渲染宫格
  gridData(): Array{
    return [
      {
        icon: <Image style={ style.icon } source={ require('./image/icon1.png') } />,
        text: '超话一键签到'
      },
      {
        icon: <Image style={ style.icon } source={ require('./image/icon2.png') } />,
        text: '一键微博点赞'
      }
    ];
  }
  render(): React.Element{
    return (
      <WingBlank size="sm">
        <Card style={ style.card }>
          <Card.Header style={ style.cardHeader }
            title={[
              <Text key="text" style={ style.text }>账号：</Text>,
              <Text key="username">{ this.props.username }</Text>
            ]}
          />
          <Card.Body>
            <Grid data={ this.gridData() } columnNum={ 3 } hasLine={ false } />
          </Card.Body>
        </Card>
      </WingBlank>
    );
  }
}

export default Index;