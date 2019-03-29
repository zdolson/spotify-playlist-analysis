import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  updateTokens,
  fetchRecentlyPlayed,
  fetchAndCalculateAll
} from '../store/actions/general';

class Calculate extends Component {
  componentDidMount() {
    this.props.dispatch(updateTokens(this.props.location.state.tokens.url, (token) => {
      this.props.dispatch(fetchRecentlyPlayed(token, () => {
        this.props.dispatch(fetchAndCalculateAll(token));
      }));
    }));
  }

  render() {
    // for (let {track} of this.props.recentlyPlayed){
    //   console.log(track.id);
    // }
    // console.log(this.props.recentlyPlayed)
    return (
      <div className='calculating-section'>
        <div className='calculating-body'>
          {this.props.loading
            ? (
                <p>
                  Calculating...
                </p>
              )
            : (
                <div>
                  <h3>FINISHED!</h3>
                  <Link to='/home/'>See the results!</Link>
                </div>
              )
          }
        </div>
        <div className='calculating-mosaic'>
          {
            this.props.recentlyPlayed.map(({track: {id, album: {images}}}) => (
              <img
                className='calc-image'
                src={images[1].url}
                key={`calc-${id}`}
                alt={`Playlist cover for: ${id}`}
                />
            ))
          }
        </div>
      </div>
    )
  }
}

export default connect(({loading, general: {recentlyPlayed}}) => ({
  recentlyPlayed,
  loading
}))(Calculate);