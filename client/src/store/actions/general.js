// General helper states
export const LOGGED_IN = 'LOGGED_IN';
export const UPDATE_TOKENS = 'UPDATE_TOKENS';
export const SELECT_PLAYLIST = 'SELECT_PLAYLIST';
export const RESET_PLAYLIST = 'RESET_PLAYLIST';
export const TOGGLE_COMPARE = 'TOGGLE_COMPARE';

// Success states
export const FETCH_SUCCESS_PLAYLISTS = 'FETCH_SUCCESS_PLAYLISTS';
export const FETCH_SUCCESS_SONGS = 'FETCH_SUCCESS_SONGS';
export const FETCH_SUCCESS_FEATURES = 'FETCH_SUCCESS_FEATURES';
export const FETCH_SUCCESS_RECENT = 'FETCH_SUCCESS_RECENT';
export const SUCCESS_AGGREGATE = 'SUCCESS_AGGREGATE';

// Pending states
export const FETCH_ATTEMPT_PLAYLISTS = 'FETCH_ATTEMPT_PLAYLISTS';
export const FETCH_ATTEMPT_SONGS = 'FETCH_ATTEMPT_SONGS';
export const FETCH_ATTEMPT_FEATURES = 'FETCH_ATTEMPT_FEATURES';
export const FETCH_ATTEMPT_RECENT = 'FETCH_ATTEMPT_RECENT';
export const ATTEMPT_AGGREGATE = 'ATTEMPT_AGGREGATE';

// Failure states
export const FETCH_FAILURE_PLAYLISTS = 'FETCH_FAILURE_PLAYLISTS';
export const FETCH_FAILURE_SONGS = 'FETCH_FAILURE_SONGS';
export const FETCH_FAILURE_FEATURES = 'FETCH_FAILURE_FEATURES';
export const FETCH_FAILURE_RECENT = 'FETCH_FAILURE_RECENT';
export const FAILED_AGGREGATE = 'FAILED_AGGREGATE';


export const baseUrl = 'https://api.spotify.com/v1/';

function login(url) {
  // console.log('logging state')
  return {
    type: LOGGED_IN,
    redirectUrl: url,
    authenticated: true,
  };
}

function tokens(accessToken, refreshToken) {
  return {
    type: UPDATE_TOKENS,
    accessToken,
    refreshToken
  }
}

export function selectPlaylist(playlistId) {
  return {
    type: SELECT_PLAYLIST,
    selectedPlaylist: playlistId
  }
}

export function resetSelectedPlaylist() {
  return {
    type: RESET_PLAYLIST
  }
}

function attemptFetch(where) {
  return {
    type: where
  }
}

function successFetch(where, whatToStore = null) {
  // Will pull different things in reducer from whatToStore depending on type.
  return {
    type: where,
    whatToStore
  }
}

function failedFetch(where) {
  return {
    type: where
  }
}

function attemptAggregate() {
  return {
    type: ATTEMPT_AGGREGATE
  }
}

function successAggregate(playlists, totalAggregate) {
  return {
    type: SUCCESS_AGGREGATE,
    playlists,
    totalAggregate
  }
}

function failedAggregate(error) {
  return {
    type: FAILED_AGGREGATE,
    error
  }
}

export function toggleCompare() {
  return {
    type: TOGGLE_COMPARE
  }
}

export function handleLogin(callback) {
  return (dispatch) => {
    return fetch('/login', {
      mode: 'no-cors'
    })
    .then((redirect) => {
      // console.log('redirect: ', redirect);
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

export function fetchRecentlyPlayed(accessToken, callback) {
  return (dispatch) => {
    let limit = '?limit=40';
    dispatch(attemptFetch(FETCH_ATTEMPT_RECENT));
    return fetch(`${baseUrl}me/player/recently-played${limit}`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      mode: 'cors'
    })
    .then(result => result.json())
    .then(({items}) => {
      dispatch(successFetch(FETCH_SUCCESS_RECENT, items));
      // dispatch(recentlyPlayed(items));
      callback();
    })
    .catch((error) => {
      // Potentially do something with error.
      dispatch(failedFetch(FETCH_FAILURE_RECENT));
      callback();
    })
  }
}

// Should break up into smaller segments if possible given time.
export function fetchAndCalculateAll(accessToken) {
  return async (dispatch) => {
    // fetch all playlists
    // fetch tracks href for each playlist, fetch and add all song ids to an array
    // for all song ids in the array, fetch features (eliminates potential unnecessary double work)

    // Playlist Fetching
    let filter = '?limit=50&fields=items(id,images,name,tracks)';
    let playlists = {};
    dispatch(attemptFetch(FETCH_ATTEMPT_PLAYLISTS));
    let playlistsObjectArray = await fetch(`${baseUrl}me/playlists${filter}`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      mode: 'cors'
    })
    .then((response) => response.json())
    .then((json) => {
      dispatch(successFetch(FETCH_SUCCESS_PLAYLISTS));
      return json.items;
    })
    .catch((error) => {
      dispatch(failedFetch(FETCH_FAILURE_PLAYLISTS));
    })


    // Songs Fetching
    let allSongs = {};
    let allSongsTotal = 0;
    let totalWithDups = 0;
    let fetchPromises = [];
    let ids = '';
    let limit = 100;
    let offset, query;

    filter = '?fields=items(added_at,track(name,id,artists))';
    playlistsObjectArray.map((playlist) => {
      playlists[playlist.id] = {
        images: playlist.images,
        name: playlist.name,
        id: playlist.id,
        tracks: playlist.tracks
      }

      if (playlist.tracks.total > 100) {
        offset = 0;
        while (offset <= playlist.tracks.total){
          query = `${filter}&offset=${offset+limit}`;
          fetchPromises.push(
              fetch(`${baseUrl}playlists/${playlist.id}/tracks${query}`, {
                headers: {
                  'Authorization': 'Bearer ' + accessToken
                },
                mode: 'cors'
              })
              .then((response) => response.json())
              .then((json) => {
                return {
                  ...json,
                  id: playlist.id
                };
              })
              .catch((error) => dispatch(failedFetch(FETCH_FAILURE_SONGS)))
          )
          offset += 100;
        }
      } else {
        query = filter;
        fetchPromises.push(
          fetch(`${baseUrl}playlists/${playlist.id}/tracks${query}`, {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            },
            mode: 'cors'
          })
          .then((response) => response.json())
          .then((json) => {
            return {
              ...json,
              id: playlist.id
            };
          })
          .catch((error) => dispatch(failedFetch(FETCH_FAILURE_SONGS)))
        )
      }
    });

    dispatch(attemptFetch(FETCH_ATTEMPT_SONGS));
    await Promise.all(
      fetchPromises
    )
    .then((responses) => {
      for (let chunk of responses) {
        for (let song of chunk.items) {
          totalWithDups++;
          if (!allSongs.hasOwnProperty(song.track.id) && song.track.id) {
            allSongsTotal++;
            let artists = song.track.artists.map((artist) => artist.name);
            allSongs[song.track.id] = {
              name: song.track.name,
              artists: artists
            }
            playlists[chunk.id].tracks.ids = playlists[chunk.id].tracks.ids
              ? playlists[chunk.id].tracks.ids.concat(song.track.id)
              : [song.track.id]
          } else if (!song.track.id) {
            // Potentially do something when a song has no ID (ie, locally added)
          }
        }
      }
      dispatch(successFetch(FETCH_SUCCESS_SONGS));
    })
    .catch((error) => dispatch(failedFetch(FETCH_FAILURE_SONGS)))

    // Feature Fetching
    fetchPromises = [];
    if (allSongsTotal > 100) {
      offset = 0;
      while (offset <= allSongsTotal){
        let currentMax = (allSongsTotal-offset)/100 >= 1 ? 100 : (allSongsTotal%100)
        for (let index = 0; index < currentMax; index++) {
          ids += Object.keys(allSongs)[index+offset] + (index - offset === 99 ? '' : ',');
        }
        fetchPromises.push(
          fetch(`${baseUrl}audio-features?ids=${ids}`, {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            },
            mode: 'cors'
          })
          .then((response) => response.json())
          .catch((error) => dispatch(failedFetch(FETCH_FAILURE_FEATURES)))
        )
        offset += 100;
        ids = '';
      }
    } else {
      for (let song in allSongs) {
        ids += song.id + ',';
      }
      fetchPromises.push(
        fetch(`${baseUrl}audio-features?ids=${ids}`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          mode: 'cors'
        })
        .then((response) => response.json())
      )
    }

    dispatch(attemptFetch(FETCH_ATTEMPT_FEATURES));
    await Promise.all(
      fetchPromises
    )
    .then((responses) => {
      let features = [];
      for (let response of responses) {
        features = features.concat(response.audio_features);
      }
      for (let feature of features) {
        allSongs[feature.id].features = feature;
      }
      // console.log(allSongs);
      dispatch(successFetch(FETCH_SUCCESS_FEATURES, allSongs));
    })
    .catch((error) => dispatch(failedFetch(FETCH_FAILURE_FEATURES)))


    // Aggregation Section
    const aggregateTemplate = {
      valence: 0,
      loudness: 0,
      tempo: 0,
      energy: 0,
      danceability: 0,
      acousticness: 0,
      // key: 0
    }
    dispatch(attemptAggregate());
    try {
      for (let playlist in await playlists) {
        let total = playlists[playlist].tracks.ids.length;
        let aggregate = Object.assign({}, aggregateTemplate);
        for (let songId of playlists[playlist].tracks.ids){
          let songFeatures = allSongs[songId].features;
          for (let column in aggregate) {
            aggregate[column] = aggregate[column] + songFeatures[column];
          }
        }
        for (let column in aggregate) {
          if (column === 'loudness')
            aggregate[column] = 1 - parseFloat(Math.abs((aggregate[column] / total)/60).toFixed(3));
          else if (column === 'tempo')
            aggregate[column] = parseFloat(Math.abs((aggregate[column] / total)/280).toFixed(3));
          else aggregate[column] = parseFloat((aggregate[column] / total).toFixed(3));
        }
        playlists[playlist].aggregatedValues = aggregate;
      }

      let totalAggregate = Object.assign({}, aggregateTemplate);
      for (let playlist in playlists) {
        for (let column in totalAggregate) {
          totalAggregate[column] += playlists[playlist].aggregatedValues[column];
        }
      }
      let numOfPlaylists = Object.keys(playlists).length;
      totalAggregate = {
        valence: totalAggregate.valence/numOfPlaylists,
        loudness: totalAggregate.loudness/numOfPlaylists,
        tempo: totalAggregate.tempo/numOfPlaylists,
        energy: totalAggregate.energy/numOfPlaylists,
        danceability: totalAggregate.danceability/numOfPlaylists,
        acousticness: totalAggregate.acousticness/numOfPlaylists,
      }
      // playlists.totalAggregate = Object.assign({}, totalAggregate);
      dispatch(successAggregate(playlists, totalAggregate));
    } catch(error) {
      dispatch(failedAggregate(error));
    }
  }
}

export function fetchUserInfo() {

}
