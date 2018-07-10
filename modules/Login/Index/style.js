import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  box: {
    paddingTop: 40,
    height: '100%'
  },
  list: {
    marginBottom: 30
  },
  head: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40,
    width: 150,
    height: 150
  },
  subBtn: {
    borderRadius: 0
  },
  // 手势验证
  shoushiModal: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },
  shoushiModalTitle: {
    position: 'absolute',
    top: '50%',
    left: 0,
    marginTop: -120,
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  shoushiBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -70,
    marginLeft: -100,
    padding: 20,
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  close: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 20,
    width: 80,
    height: 80
  },
  closeIcon: {
    width: 40,
    height: 40
  },
  huadongView: {
    width: 160,
    height: 160
  }
});