import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchSongs} from '../store/actions/general';

class Songs extends Component {
  componentDidMount() {
    let total;
    for (let playlist of this.props.playlists){
      if (playlist.id === this.props.selectedPlaylist)
        total = playlist.tracks.total;
    }
    this.props.dispatch(fetchSongs(this.props.accessToken, this.props.selectedPlaylist, total))
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedPlaylist !== prevProps.selectedPlaylist){
      let total;
      for (let playlist of this.props.playlists){
        if (playlist.id === this.props.selectedPlaylist)
          total = playlist.tracks.total;
      }
      this.props.dispatch(fetchSongs(this.props.accessToken, this.props.selectedPlaylist, total))
    }
  }

  render() {
    return (
      <div className='list-group list-group-flush'>
        {this.props.playlistSongs[this.props.selectedPlaylist].map((song) => (
          <li key={song.track.id} className='list-group-item'>{song.track.name}</li>
        ))}
      </div>
    )
  }
}

export default connect(({loading, general: {selectedPlaylist, accessToken, playlistSongs, playlists}}) => ({
  selectedPlaylist,
  accessToken,
  playlistSongs,
  playlists,
  loading
}))(Songs);