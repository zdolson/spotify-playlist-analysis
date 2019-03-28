import React from 'react';

// import d3 from 'd3';

const polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance;
const polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance;

const noSmoothing = (points) => {
	let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4)
	for (let i = 1; i < points.length; i++) {
		d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4)
	}
	return d + 'z'
}

/*
 * Formats 2D array of cartesian (x,y) points to necessary format for svg lines
 * ex. [ [2,4], [5,1], ...] -> '2,4 5,1 ...'
 */
const points = (points) => {
	return points
	.map(point => point[0].toFixed(4) + ',' + point[1].toFixed(4))
	.join(' ')
}

function Radar(props) {
  let svgComponents = [];
  let buffer = parseInt(props.size) + 50;

  // Dummy data
  const data = [
    {
      valence: 0.7,
      loudness: .8,
      tempo: 0.9,
      energy: 0.67,
      danceability: 0.8,
      acousticness: 0.3,
      key: 0.1
    }
  ];

  // Captions = number of points to create a path with.
  let captions = {
    valence: 'Valence',
    loudness: 'Loudness',
    tempo: 'Tempo',
    energy: 'Energy',
    danceability: 'Danceability',
    acousticness: 'Acousticness',
  };

  captions = Object.keys(captions).map((key, i, all) => ({
		key, caption: captions[key],
		angle: Math.PI * 2 * i / all.length
	}));

  for (let scale = 4; scale > 0; scale--) {
    svgComponents.push(
      <circle
        className='radar-scales'
        key={`scale-${scale}`}
        cx={0}
        cy={0}
        r={props.size/2}/>
    );
  }

  // let polylineArray = [];
  // let labels = [];
  for (let prop of captions) {
    svgComponents.push(
      <polyline
        className='polyline'
        key={`polyline-${prop.caption}`}
        points={points([
    			[0, 0], [
    				polarToX(prop.angle, props.size / 2),
    				polarToY(prop.angle, props.size / 2)
    			]
    		])}/>
    )
    svgComponents.push(
      <text
        className='radar-label'
        key={`label-${prop.caption}`}
        textAnchor='middle'
        x={polarToX(prop.angle, props.size / 2).toFixed(4)}
        y={polarToY(prop.angle, props.size / 2).toFixed(4)}
        dy='10'>
        {prop.caption}
      </text>
    )
  }
  // for the data array of datum objects
  svgComponents.push(data.map((datum, index) => {
    // let points = [];
    // console.log(datum)
    let path = noSmoothing(captions.map((column) => {
      const value = datum[column.key]
      // if ('number' !== typeof value) {
      //   throw new Error(`Data set ${i} is invalid.`)
      // }

      return [
        polarToX(column.angle, value * props.size / 2),
        polarToY(column.angle, value * props.size / 2)
      ]
    }))
    return (
      <path className='radar-shape' key={`path-${index}`} d={path}/>
    )
  }));



  return (
    <svg className='radar-chart' height={buffer} width={buffer}>
      <g transform={`translate(${buffer/2},${buffer/2})`}>
        {svgComponents}
      </g>
    </svg>
  );
}

// <text x={} y={} textAnchor='middle'></text>
// <text x={} y={} textAnchor='middle'></text>
// <text x={} y={} textAnchor='middle'></text>
// <text x={} y={} textAnchor='middle'></text>
// <text x={} y={} textAnchor='middle'></text>
// <text x={} y={} textAnchor='middle'></text>
// <text x={} y={} textAnchor='middle'></text>




export default Radar;