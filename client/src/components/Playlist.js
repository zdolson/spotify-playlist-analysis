import React, {Component} from 'react';
import {connect} from 'react-redux';

class Playlist extends Component {
  render() {
    return (
      <div>
        Playlist
      </div>
    )
  }
}

export default connect((state) => ({
  loading: state.loading
}))(Playlist);