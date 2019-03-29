import {
  LOGGED_IN,
  UPDATE_TOKENS,
  SELECT_PLAYLIST,
  RESET_PLAYLIST,
  FETCH_SUCCESS_PLAYLISTS,
  FETCH_SUCCESS_SONGS,
  FETCH_SUCCESS_FEATURES,
  FETCH_SUCCESS_RECENT,
  SUCCESS_AGGREGATE,
  TOGGLE_COMPARE,
  // FETCH_FAILURE_PLAYLISTS,
  // FETCH_FAILURE_SONGS,
  // FETCH_FAILURE_FEATURES,
  // FETCH_FAILURE_RECENT,
  // FAILED_AGGREGATE,
} from '../actions/general';

const defaultState = {
  playlists: {},
  redirectUrl: '',
  authenticated: false,
  accessToken: '',
  refreshToken: '',
  selectedPlaylist: '',
  allSongs: {},
  recentlyPlayed: [],
  compareEnabled: false,
}

function general (state = defaultState, action) {
  switch(action.type){
    case LOGGED_IN:
      return {
        ...state,
        redirectUrl: action.redirectUrl,
        authenticated: action.authenticated,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    case UPDATE_TOKENS:
      return {
        ...state,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken
      }
    case SELECT_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: action.selectedPlaylist,
      }
    case RESET_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: '',
      }
    case TOGGLE_COMPARE:
      return {
        ...state,
        compareEnabled: !state.compareEnabled,
      }
    case FETCH_SUCCESS_PLAYLISTS:
    case FETCH_SUCCESS_SONGS:
      // Purely exist in the event I need to do something here.
      return state;
    case FETCH_SUCCESS_FEATURES:
      // This is when we all of the songs are logged and evaluated/prepped
      return {
        ...state,
        allSongs: action.whatToStore
      }
    case SUCCESS_AGGREGATE:
      // This is when our playlists have also been prepped for the app.
      return {
        ...state,
        playlists: action.playlists,
        totalAggregate: action.totalAggregate,
      }
    case FETCH_SUCCESS_RECENT:
      return {
        ...state,
        recentlyPlayed: action.whatToStore
      }
    default:
      return state
  }
}

export default general;