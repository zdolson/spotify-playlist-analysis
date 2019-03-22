import React, {Component} from 'react';
import {connect} from 'react-redux';
import PlaylistSelection from './PlaylistSelection';
import AnalysesSection from './AnalysesSection';
import {updateTokens, fetchPlaylists} from '../store/actions/general';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
      features: {}
    }
  }

  componentDidMount() {
    this.props.dispatch(updateTokens(this.props.location.state.tokens.url, (token) => {
      // console.log('returned token: ', token);
      this.props.dispatch(fetchPlaylists(token));
    }));

    // fetch(`${baseUrl}me/playlists`, {
    //   headers: {
    //     'Authorization': 'Bearer ' + accessToken
    //   },
    //   mode: 'cors'
    // // }).then(result => console.log(result.body));
    // }).then(result => result.json())
    // .then((json) => {
    //   const playlists = json.items.filter(playlist => {
    //     const playlistObjects = {};
    //     if (playlist.name === 'Starred' || playlist.name === 'In Limbo'){
    //       console.log('Playlist ID: ', playlist.id)
    //       // playlistObjects[playlist.name] = playlist.id;
    //       return playlist;
    //     }
    //   })
    //   console.log('playlists: ', playlists);
    //   const filter = '?fields=items(track(name,id,album(images)))';
    //   let offset = '&offset=300';
    //   let limit = '&limit=10';
    //   let query = filter+offset+limit;
    //   Promise.all([
    //     fetch(playlists[0].tracks.href + query, {
    //       headers: {
    //         'Authorization': 'Bearer ' + accessToken
    //       },
    //       mode: 'cors'
    //     }),
    //     fetch(playlists[1].tracks.href + query, {
    //       headers: {
    //         'Authorization': 'Bearer ' + accessToken
    //       },
    //       mode: 'cors'
    //     })
    //   ]).then(results => {
    //     Promise.all([
    //       results[0].json(),
    //       results[1].json(),
    //     ])
    //     .then(tracks => {
    //       console.log('tracks: ',tracks[0].items)
    //       let ids = '?ids=';
    //       tracks[0].items.forEach(({track}, index) => {
    //         ids += track.id + (index === 99 ? '' : ',');
    //       })
    //       this.setState({
    //         songs: tracks[0].items
    //       })
    //       // console.log('ids: ', ids);
    //       fetch(`${baseUrl}audio-features/${ids}`, {
    //         headers: {
    //           'Authorization': 'Bearer ' + accessToken
    //         },
    //         mode: 'cors'
    //       })
    //       .then(response => response.json())
    //       .then(features => {
    //         console.log('features: ', features);
    //         this.setState({
    //           accessToken,
    //           refreshToken,
    //           features
    //         });
    //         // console.log('songs: ', this.state.songs);
    //       });
    //     });
    //   })
    // });
  }

  // <h3>Token is: {this.state.accessToken}</h3>
  // <br />
  // <ul>
  //   {this.state.songs.map(({track}) => (
  //     <li key={track.id}>
  //       <img
  //         src={track.album.images[2].url}
  //         alt={'Album cover for ' + track.name}
  //         />
  //       <h4>{track.name}</h4>
  //     </li>
  //   ))}
  // </ul>

  render() {
    return (
      <div className="conainer-fluid row align-items-stretch h-100">
        <div className="thick-border col-3 bg-danger border border-dark rounded">
          <PlaylistSelection />
        </div>

        <div className="thick-border col-7 bg-warning border border-dark rounded">
          <AnalysesSection />
        </div>

        <div className="thick-border col-2 bg-info border border-dark rounded">

        </div>
      </div>
    )
  }
}

export default connect(({loading, general: {accessToken, refreshToken, authenticated, playlists}}) => ({
  accessToken,
  refreshToken,
  authenticated,
  playlists,
  loading,
}))(Home);