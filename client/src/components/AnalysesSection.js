import React, {Component} from 'react';
import {connect} from 'react-redux';
// import RadarChart from 'react-svg-radar-chart';

// import {fetchSongFeatures} from '../store/actions/general';
// import Songs from './Songs';
import Radar from './Radar';

class AnalysesSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      defaultData: {
        data: {
          valence: 0.0,
          loudness: 0.0,
          tempo: 0.0,
          energy: 0.0,
          danceability: 0.0,
          acousticness: 0.0,
          // key: 0.0
        },
        meta: { color: 'black' }
      }
    }
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.selectedPlaylist !== this.props.selectedPlaylist){
  //     this.setState({
  //       data: this.state.defaultData
  //     })
  //     if (this.props.selectedPlaylist !== '' && this.props.playlistAggregate){
  //       this.updateDataState();
  //     }
  //   }
  // }
  //
  // updateDataState = () => {
  //   this.setState({
  //     data: {
  //       data: this.props.playlistAggregate[this.props.selectedPlaylist],
  //       meta: {color: 'red'}
  //     }
  //   });
  // }

  render() {

    // console.log(this.props);

    // <div className='container-fluid row h-100'>
    //   <div className='col-4 border border-dark rounded'>
    //     {
    //       this.props.selectedPlaylist === ''
    //         ? 'Select a playlist'
    //         : <Songs />
    //     }
    //   </div>
    //   <div className='col-8 border border-dark rounded'>
    //     {
    //       this.props.loading || !this.props.playlistAggregate
    //       ? <RadarChart
    //         captions={captions}
    //         data={[
    //           this.state.defaultData
    //         ]}
    //         size={440}
    //         />
    //       : <RadarChart
    //         captions={captions}
    //         data={[
    //           {
    //             data:
    //               !this.props.playlistAggregate[this.props.selectedPlaylist]
    //                 ? this.state.defaultData.data
    //                 : this.props.playlistAggregate[this.props.selectedPlaylist],
    //             meta: {color: 'red'}
    //           }
    //         ]}
    //         size={440}
    //         />
    //     }
    //   </div>
    // </div>

    return (
      <div className='analyses-section'>
        <h4>Analyses Graph</h4>
        <Radar size='450'/>
      </div>
    )
  }
}

export default connect(({loading, general: {selectedPlaylist, accessToken, playlists}}) => ({
  selectedPlaylist,
  accessToken,
  loading,
  playlists,
}))(AnalysesSection);