import React, {Component} from 'react';
import {connect} from 'react-redux';
import PlaylistSelection from './PlaylistSelection';
import AnalysesSection from './AnalysesSection';
import {updateTokens, fetchPlaylists} from '../store/actions/general';

class Home extends Component {

  componentDidMount() {
    this.props.dispatch(updateTokens(this.props.location.state.tokens.url, (token) => {
      this.props.dispatch(fetchPlaylists(token));
    }));
  }

  render() {
    return (
      <div className="conainer-fluid h-100 row p-2 overflow-auto">
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