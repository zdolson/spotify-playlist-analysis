// import actions
import {combineReducers} from 'redux';
import loading from './loading';
import general from './general';

export default combineReducers({
  loading,
  general
})