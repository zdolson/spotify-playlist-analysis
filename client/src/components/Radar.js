import React from 'react';

import RadarChart from 'react-svg-radar-chart';
// import 'react-svg-radar-chart/build/css/index.css';

class Radar extends React.Component {
  render() {
 	 const data = [
      {
        data: {
          valence: 0.7,
          loudness: .8,
          tempo: 0.9,
          energy: 0.67,
          danceability: 0.8,
          acousticness: 0.3,
          key: 0.1
        },
        meta: { color: 'blue' }
      },
      {
        data: {
          valence: 0.6,
          loudness: .85,
          tempo: 0.5,
          energy: 0.6,
          danceability: 0.7,
          acousticness: 0.8,
          key: 0.6
        },
        meta: { color: 'red' }
      }
    ];

    const captions = {
      // columns
      valence: 'Battery Capacity',
      loudness: 'Design',
      tempo: 'Usefulness',
      energy: 'Speed',
      danceability: 'Weight',
      acousticness: 'Acousticness',
      key: 'Key'
    };

    return (
      <div>
        <RadarChart
            captions={captions}
            data={[
              data[0],
              data[1],
            ]}
            size={400}
          />
        </div>
    );
  }
}

export default Radar;