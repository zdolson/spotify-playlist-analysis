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

  // <div className="conainer-fluid h-100 row p-2 overflow-auto">
  //   <div className="thick-border col-3 bg-danger border border-dark rounded">
  //     <PlaylistSelection />
  //   </div>
  //
  //   <div className="thick-border col-7 bg-warning border border-dark rounded">
  //     <AnalysesSection />
  //   </div>
  //
  //   <div className="thick-border col-2 bg-info border border-dark rounded">
  //
  //   </div>
  // </div>

  render() {
    return (
      <div className='container-fluid d-flex flex-column justify-content-between overflow-auto h-100'>
        <div className='d-flex justify-content-between'>
          <span>{this.props.selectedPlaylist}</span>
          <span>Foobar on the right</span>
        </div>
        <div className='home-container row bg-info h-75'>
          <div className='col-3 d-flex flex-column justify-content-between'>
            <div className='d-flex flex-column align-items-center h-50'>
              <span className=''><b>Year</b></span>
            </div>
            <div className='d-flex flex-column align-items-center h-50'>
              <span className=''><b>Genre</b></span>
            </div>
          </div>
          <div className='col-6'>
            <AnalysesSection />
          </div>
          <div className='col-3 d-flex flex-column justify-content-between'>
            <div className='d-flex flex-column align-items-center h-50'>
              <span className=''><b>Details</b></span>
            </div>
            <div className='d-flex flex-column align-items-center h-50'>
              <span className=''><b>Compare</b></span>
            </div>
          </div>
        </div>
        <div className='row bg-success h-25'>
          <PlaylistSelection />
        </div>
      </div>
    )
  }
}

export default connect(({loading, general: {accessToken, refreshToken, authenticated, playlists, selectedPlaylist}}) => ({
  accessToken,
  refreshToken,
  authenticated,
  playlists,
  loading,
  selectedPlaylist
}))(Home);