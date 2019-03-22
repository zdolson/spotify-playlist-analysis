import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selectPlaylist} from '../store/actions/general';
// import Playlist from './Playlist';

class PlaylistSelection extends Component {
  selectPlaylist = (playlistId) => {
    this.props.dispatch(selectPlaylist(playlistId));
  }

  render() {
    return (
      <div>
        {this.props.playlists.map((playlist) => (
          <div className='list-group'
            key={playlist.id}
            onClick={() => this.selectPlaylist(playlist.id)}>
            <div className='row no-gutters list-group-item-action list-group-item-dark'>
              <div className='col-4'>
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className='card-img'
                  />
              </div>
              <div className='col-8'>
                <div className='card-body'>
                  <h6 className='card-title'>{playlist.name}</h6>
                  <p className='card-text'>{playlist.tracks.total}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default connect(({loading, general: {playlists}}) => ({
  loading,
  playlists
}))(PlaylistSelection);

// <li key={playlist.id}>
//   <img
//     src={playlist.images[0].url}
//     alt={'Playlist image for ' + playlist.name}
//     />
//   <h4>{playlist.name}</h4>
//   <h5>Total: {playlist.tracks.total}</h5>
// </li>