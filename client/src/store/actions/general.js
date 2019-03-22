export const LOGGED_IN = 'LOGGED_IN';
export const ADD_PLAYLISTS = 'ADD_PLAYLISTS';
export const UPDATE_TOKENS = 'UPDATE_TOKENS';
export const SELECT_PLAYLIST = 'SELECT_PLAYLIST';
export const RETRIEVE_SONGS = 'RETRIEVE_SONGS';
export const ADD_PLAYLIST_SONGS = 'ADD_PLAYLIST_SONGS';
export const RETRIEVE_FEATURES = 'RETRIEVE_FEATURES';
export const ADD_PLAYLIST_FEATURES = 'ADD_PLAYLIST_FEATURES';
export const ADD_PLAYLIST_AGGREGATE = 'ADD_PLAYLIST_AGGREGATE';

export const baseUrl = 'https://api.spotify.com/v1/';

function login(url) {
  console.log('logging state')
  return {
    type: LOGGED_IN,
    redirectUrl: url,
    authenticated: true,
  };
}

function playlists(playlists) {
  return {
    type: ADD_PLAYLISTS,
    playlists
  };
}

function tokens(accessToken, refreshToken) {
  return {
    type: UPDATE_TOKENS,
    accessToken,
    refreshToken
  }
}

function retrieveSongs() {
  return {
    type: RETRIEVE_SONGS
  }
}

function retrieveFeatures() {
  return {
    type: RETRIEVE_FEATURES
  }
}

function addPlaylistSongs(playlistId, songs) {
  return {
    type: ADD_PLAYLIST_SONGS,
    id: playlistId,
    songs
  }
}

function addPlaylistFeatures(playlistId, features) {
  return {
    type: ADD_PLAYLIST_FEATURES,
    id: playlistId,
    features
  }
}

function addPlaylistAggregate(playlistId, aggregate) {
  return {
    type: ADD_PLAYLIST_AGGREGATE,
    id: playlistId,
    aggregate
  }
}

export function selectPlaylist(playlistId) {
  return {
    type: SELECT_PLAYLIST,
    selectedPlaylist: playlistId
  }
}

export function handleLogin(callback) {
  return (dispatch) => {
    return fetch('/login', {
      mode: 'no-cors'
    })
    .then((redirect) => {
      console.log('redirect: ', redirect);
      dispatch(login(redirect.url));
      callback();
    })
    .catch(() => {
      alert('An error occured. Reload page.');
    })
  }
}

export function updateTokens(url, callback) {
  return (dispatch) => {
    const startAccess = url.indexOf('access_token=');
    const startRefresh = url.indexOf('refresh_token=');
    const accessToken = url.substring(startAccess+13, startRefresh-1);
    const refreshToken = url.substring(startRefresh+14);
    dispatch(tokens(accessToken, refreshToken));
    return callback(accessToken);
  }
}

export function fetchPlaylists(accessToken) {
  return (dispatch) => {
    let filter = '?fields=items(id,images,name,tracks)';
    // let offset = '&offset=0';
    // let limit = '&limit=10';
    // let query = filter+offset+limit;
    return fetch(`${baseUrl}me/playlists${filter}`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      mode: 'cors'
    })
    .then(result => result.json())
    .then(json => {
      // console.log(json);
      dispatch(playlists(json.items))
    });
  }
}

export function fetchSongs(accessToken, playlistId, total) {
  return async (dispatch) => {
    dispatch(retrieveSongs());
    console.log('total before: ', total);
    let filter = '?fields=items(added_at,track(name,id,artists))';
    let offset, query, result, songs, uniqueSongs, ids = {}, features = [], aggregate, limit = '&limit=100', idQuery = '?ids=';

    if (total > 99) {
      songs = [];
      offset = 0;
      while (offset <= total){
        query = `${filter}&offset=${offset+limit}`;
        result = await (await fetch(`${baseUrl}playlists/${playlistId}/tracks${query}`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          mode: 'cors'
        }))
        result = await result.json();
        offset += 100;
        songs = songs.concat(result.items);
      }
      // console.log(songs);
      // ids = {};
      uniqueSongs = songs.reduce((accumulator, current) => {
        if (!current.track.id) {
          total--;
        }
        else if (!ids.hasOwnProperty(current.track.id)) {
          ids[current.track.id] = true;
          accumulator.push(current);
        } else {
          total--;
        }
        return accumulator;
      }, [])
      console.log('songs: ', songs);
      console.log('uniqueSongs: ', uniqueSongs);
      dispatch(addPlaylistSongs(playlistId, uniqueSongs));
      // songs = uniqueSongs;
    } else {
      offset = '&offset=0';
      query = filter+offset+limit;
      result = await fetch(`${baseUrl}playlists/${playlistId}/tracks${query}`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        mode: 'cors'
      })
      result = await result.json();
      // console.log(result);
      // ids = {};
      uniqueSongs = result.items.reduce((accumulator, current) => {
        // First check if valid song, no idea === not valid.
        // console.log('current.track.id: ', current.track.id);
        if (!current.track.id) {
          total--;
        }
        else if (!ids.hasOwnProperty(current.track.id)) {
          ids[current.track.id] = true;
          console.log('current: ', current);
          accumulator.push(current);
        } else {
          // We have a duplicate, do nothing and reduce valid total
          total--;
        }
        return accumulator;
      }, [])
      // songs = Array.from(new Set(result.items));
      dispatch(addPlaylistSongs(playlistId, uniqueSongs));
    }
    // now for features
    //reset ids
    console.log('total after: ', total);
    ids = '';
    console.log('uniqueSongs: ', uniqueSongs);
    dispatch(retrieveFeatures());
    if (total > 100) {
      offset = 0;
      while (offset <= total){
        // console.log('offset: ', offset);
        // console.log('total%100: ', total%100);
        // console.log('total-offset/100: ', (total-offset)/100);
        let currentMax = (total-offset)/100 >= 1 ? 100 : (total%100)
        // console.log('currentMax: ', currentMax);
        for (let index = 0; index < currentMax; index++) {
          // console.log('index: ', index+offset);
          ids += uniqueSongs[index+offset].track.id + (index - offset === 99 ? '' : ',');
        }
        // console.log('ids: ', ids);
        // query = `${filter}&offset=${offset+limit}`;
        result = await (await fetch(`${baseUrl}audio-features${idQuery + ids}`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          mode: 'cors'
        }))
        result = await result.json();
        offset += 100;
        features = features.concat(result.audio_features);
        ids = '';
      }
      // console.log(songs);
      dispatch(addPlaylistFeatures(playlistId, features));
    } else {
      // console.log(ids);
      uniqueSongs.forEach(({track}, index) => {
        ids += track.id + (index === 99 ? '' : ',');
      })
      // console.log('ids: ', ids);
      offset = '&offset=0';
      query = filter+offset+limit;
      result = await fetch(`${baseUrl}audio-features${idQuery + ids}`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        mode: 'cors'
      })
      features = await result.json();
      features = features.audio_features
      dispatch(addPlaylistFeatures(playlistId, features));
    }
    console.log('features: ', features);
    //aggregate
    // console.log('features: ', features);
    aggregate = {
      valence: 0,
      loudness: 0,
      tempo: 0,
      energy: 0,
      danceability: 0,
      acousticness: 0,
      // key: 0
    }

    for (let feature of features) {
      // console.log('feature: ', feature);
      for (let prop in aggregate) {
        // console.log(prop);
        aggregate[prop] = aggregate[prop] + feature[prop];
      }
    }
    for (let prop in aggregate) {
      if (prop === 'loudness')
        aggregate[prop] = 1 - parseFloat(Math.abs((aggregate[prop] / total)/60).toFixed(3));
      else if (prop === 'tempo')
        aggregate[prop] = parseFloat(Math.abs((aggregate[prop] / total)/280).toFixed(3));
      else aggregate[prop] = parseFloat((aggregate[prop] / total).toFixed(3));
    }
    // console.log(aggregate);
    dispatch(addPlaylistAggregate(playlistId, aggregate));
  }
}

// export function fetchSongFeatures(accessToken, songs, total) {
//   return async (dispatch) => {
//     console.log(songs);
//     console.log(total);
//     dispatch(retrieveFeatures());
//     let filter = '?fields=items(added_at,track(name,id,artists))';
//     let offset, query, result, limit = '&limit=100';
//     let ids = '?ids=';
//
//     if (total > 99) {
//       offset = 0;
//       while (offset <= total){
//         for (let index = offset; index < total; index++) {
//           ids += songs[index].track.id + (index === 99 ? '' : ',');
//         }
//         // query = `${filter}&offset=${offset+limit}`;
//         result = await (await fetch(`${baseUrl}audio-features${ids}`, {
//           headers: {
//             'Authorization': 'Bearer ' + accessToken
//           },
//           mode: 'cors'
//         }))
//         result = await result.json();
//         offset += 100;
//         songs = songs.concat(result.items);
//       }
//       console.log(songs);
//       // return dispatch(addPlaylistSongs(playlistId, songs));
//     } else {
//       songs.forEach(({track}, index) => {
//         ids += track.id + (index === 99 ? '' : ',');
//       })
//
//       offset = '&offset=0';
//       query = filter+offset+limit;
//       result = await fetch(`${baseUrl}audio-features${ids}`, {
//         headers: {
//           'Authorization': 'Bearer ' + accessToken
//         },
//         mode: 'cors'
//       })
//       result = await result.json();
//       console.log(result);
//       // dispatch(addPlaylistSongs(playlistId, result.items));
//     }
//   }
// }

export function fetchUserInfo() {

}
