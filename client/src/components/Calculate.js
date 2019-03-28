import React, {Component} from 'react';
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
    console.log(this.props.recentlyPlayed)
    return (
      <div className='calculating-section'>
        <div className='calculating-body'>
          Calculating...
        </div>
        <div className='calculating-mosaic'>
          {
            this.props.recentlyPlayed.map(({track: {id, album: {images}}}) => (
              <img
                className='calc-image'
                src={images[1].url}
                key={id}
                />
            ))
          }
        </div>
      </div>
    )
  }
}

export default connect(({general: {recentlyPlayed}}) => ({
  recentlyPlayed,
}))(Calculate);