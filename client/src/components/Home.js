import React, {Component} from 'react';
import {connect} from 'react-redux';
import PlaylistSelection from './PlaylistSelection';
import AnalysesSection from './AnalysesSection';
import {resetSelectedPlaylist, toggleCompare} from '../store/actions/general';

class Home extends Component {

  render() {
    console.log(this.props);
    return (
      <div className='container-fluid d-flex flex-column justify-content-between overflow-auto h-100'>
        <div className='d-flex justify-content-between'>
          <span>
            Currently Displayed to Graph:
            {
              this.props.selectedPlaylist
                ? ` ${this.props.playlists[this.props.selectedPlaylist].name}`
                : ' Averages over account'
            }
          </span>
          {
            this.props.selectedPlaylist
              ? (
                  <span
                    className=''
                    onClick={() => this.props.dispatch(resetSelectedPlaylist())}
                    >Back to total average
                  </span>
                )
              : null
          }

        </div>
        <div className='home-container row h-75'>
          <div className='col-3 home-panel d-flex flex-column justify-content-between'>
            <div className='d-flex flex-column align-items-center h-50'>
              <span className='section-label'><b>Year Added</b></span>
            </div>
            <div className='d-flex flex-column align-items-center h-50'>
              <span className='section-label'><b>Genre</b></span>
            </div>
          </div>
          <div className='col-6'>
            <AnalysesSection />
          </div>
          <div className='col-3 home-panel d-flex flex-column justify-content-between'>
            <div className='d-flex flex-column align-items-center h-50'>
              <span className='section-label'>
                <b>User Details</b>
              </span>
            </div>
            <div className='d-flex flex-column align-items-center h-50'>
              <span
                className='section-label'
                onClick={() => this.props.dispatch(toggleCompare())}>
                <b>Compare</b>
              </span>
            </div>
          </div>
        </div>
        <div className='home-playlists row'>
          <h4>Your Playlists</h4>
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