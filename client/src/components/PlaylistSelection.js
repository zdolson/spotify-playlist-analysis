import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selectPlaylist} from '../store/actions/general';
// import Playlist from './Playlist';

class PlaylistSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistTriggers: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.playlists.length > 0 &&
      (Object.keys(this.state.playlistTriggers).length === 0 &&
      this.state.playlistTriggers.constructor === Object)){
      let tempObj = {};
      for (let prop of this.props.playlists) {
        tempObj[prop.id] = false;
      }
      this.setState({
        playlistTriggers: tempObj
      })
    }
  }

  selectPlaylist = (playlistId) => {
    this.props.dispatch(selectPlaylist(playlistId));

    this.setState({
      ...this.state,
      playlistTriggers: {
        ...this.state.playlistTriggers,
        [playlistId]: !this.state.playlistTriggers[playlistId]
      }
    });
  }

  // <div className='list-group'
  //   key={playlist.id}
  //   onClick={() => this.selectPlaylist(playlist.id)}>
  //   <div className='row no-gutters list-group-item-action list-group-item-dark'>
  //     <div className='col-4'>
  //       <img
  //         src={playlist.images[0] ? playlist.images[0].url : '../media/no-image-icon.png'}
  //         alt={playlist.name}
  //         className='card-img'
  //         />
  //     </div>
  //     <div className='col-8'>
  //       <div className='card-body'>
  //         <h6 className='card-title'>{playlist.name}</h6>
  //         <p className='card-text'>{playlist.tracks.total}</p>
  //       </div>
  //     </div>
  //   </div>
  // </div>


  // <div className='playlist-selection'>
  //   {this.props.playlists.map((playlist) => (
  //     <div className='playlist-item' key={playlist.id}>
  //       <img
  //         className='playlist-image'
  //         src={playlist.images[0].url}
  //         />
  //       <span>{playlist.name}</span>
  //     </div>
  //   ))}
  // </div>

  render() {
    // console.log(this.props);
    return (
      <ul className='playlist-list overflow-auto'>
        {this.props.playlists.slice(0,5).map((playlist) => (
          <li
            className={
              this.state.playlistTriggers[playlist.id]
                ? 'playlist-item-expanded'
                : 'playlist-item'
            }
            id={`playlist-${playlist.id}`}
            onClick={() => this.selectPlaylist(playlist.id)}
            key={playlist.id}>
            {
              !this.state.playlistTriggers[playlist.id]
                ? <img
                    className='playlist-image'
                    src={playlist.images[0].url}
                    />
                : null
            }
            <span className='text-center'>{playlist.name}</span>
            {
              this.state.playlistTriggers[playlist.id]
                ? <span>{playlist.tracks.total} tracks</span>
                : null
            }
          </li>
        ))}
      </ul>
    )
  }
}

export default connect(({loading, general: {playlists, selectedPlaylist}}) => ({
  loading,
  playlists,
  selectedPlaylist
}))(PlaylistSelection);

// <li key={playlist.id}>
//   <img
//     src={playlist.images[0].url}
//     alt={'Playlist image for ' + playlist.name}
//     />
//   <h4>{playlist.name}</h4>
//   <h5>Total: {playlist.tracks.total}</h5>
// </li>