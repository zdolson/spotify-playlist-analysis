import {
  LOGGED_IN,
  FETCH_ATTEMPT_PLAYLISTS,
  FETCH_ATTEMPT_SONGS,
  FETCH_ATTEMPT_FEATURES,
  FETCH_ATTEMPT_RECENT,
  FETCH_SUCCESS_PLAYLISTS,
  FETCH_SUCCESS_SONGS,
  FETCH_SUCCESS_FEATURES,
  FETCH_SUCCESS_RECENT,
  FETCH_FAILURE_PLAYLISTS,
  FETCH_FAILURE_SONGS,
  FETCH_FAILURE_FEATURES,
  FETCH_FAILURE_RECENT,
  ATTEMPT_AGGREGATE,
  SUCCESS_AGGREGATE,
  FAILED_AGGREGATE,
} from '../actions/general';

export default function loading(state = true, action){
  switch(action.type){
    case LOGGED_IN:
      return false

    case FETCH_ATTEMPT_SONGS:
      return true
    case FETCH_ATTEMPT_FEATURES:
      return true
    case FETCH_ATTEMPT_PLAYLISTS:
      return true
    case FETCH_ATTEMPT_RECENT:
      return true
    case ATTEMPT_AGGREGATE:
      return true

    case FETCH_SUCCESS_SONGS:
      return true
    case FETCH_SUCCESS_FEATURES:
      return true
    case FETCH_SUCCESS_PLAYLISTS:
      return true
    case FETCH_SUCCESS_RECENT:
      return true
    case SUCCESS_AGGREGATE:
      return false

    case FETCH_FAILURE_SONGS:
      return false
    case FETCH_FAILURE_FEATURES:
      return false
    case FETCH_FAILURE_PLAYLISTS:
      return false
    case FETCH_FAILURE_RECENT:
      return false
    case FAILED_AGGREGATE:
      return false

    default:
      return state
  }
}