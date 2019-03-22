import {
  LOGGED_IN,
  ADD_PLAYLIST_SONGS,
  ADD_PLAYLIST_FEATURES,
  RETRIEVE_SONGS,
  RETRIEVE_FEATURES,
} from '../actions/general';

export default function loading(state = true, action){
  switch(action.type){
    case LOGGED_IN:
      return false
    case ADD_PLAYLIST_SONGS:
      // console.log('turning loading off');
      return false
    case ADD_PLAYLIST_FEATURES:
      // console.log('turning loading off');
      return false
    case RETRIEVE_SONGS:
      return true
    case RETRIEVE_FEATURES:
      return true
    default:
      return state
  }
}