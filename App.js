/**
 * App入口
 */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-redux';
import store from './store/store';
import Routers from './router/routers';
import './components/storage/storage';

const style: Object = StyleSheet.create({
  view: {
    marginTop: 30
  }
});

class App extends Component{
  render(): React.Element{
    return (
      <Provider store={ store }>
        <View style={ style.view }>
          <NativeRouter>
            <Routers />
          </NativeRouter>
        </View>
      </Provider>
    );
  }
}

export default App;