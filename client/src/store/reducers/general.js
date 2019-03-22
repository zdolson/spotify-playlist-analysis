import {
  LOGGED_IN,
  UPDATE_TOKENS,
  ADD_PLAYLISTS,
  SELECT_PLAYLIST,
  ADD_PLAYLIST_SONGS,
  ADD_PLAYLIST_FEATURES,
  ADD_PLAYLIST_AGGREGATE,
} from '../actions/general';

const defaultState = {
  playlists: [],
  redirectUrl: '',
  authenticated: false,
  accessToken: '',
  refreshToken: '',
  selectedPlaylist: '',
  playlistSongs: {}
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
    case ADD_PLAYLISTS:
      return {
        ...state,
        playlists: action.playlists
      }
    case SELECT_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: action.selectedPlaylist,
        playlistSongs: {
          [action.selectedPlaylist]: [],
        }
      }
    case ADD_PLAYLIST_SONGS:
      return {
        ...state,
        playlistSongs: {
          ...state.playlistSongs,
          [action.id]: action.songs,
        }
      }
    case ADD_PLAYLIST_FEATURES:
    return {
      ...state,
      playlistFeatures: {
        ...state.playlistFeatures,
        [action.id]: action.features,
      }
    }
    case ADD_PLAYLIST_AGGREGATE:
    return {
      ...state,
      playlistAggregate: {
        ...state.playlistAggregate,
        [action.id]: {
          valence: action.aggregate.valence,
          loudness: action.aggregate.loudness,
          tempo: action.aggregate.tempo,
          energy: action.aggregate.energy,
          danceability: action.aggregate.danceability,
          acousticness: action.aggregate.acousticness,
          key: action.aggregate.key
        },
      }
    }
    default:
      return state
  }
}

export default general;