import React from 'react'
import ReactDOM from 'react-dom'

//import ReatHeatmap from 'react-heatmap/lib/ReactHeatmap.js'
const ReactHeatmap = require('react-heatmap');

//

module.exports =  class Heatmap2 extends React.Component {

  constructor(props)
  {
    super(props)

    this.datasize_x = 80
    this.datasize_y = 80

    this.data = []
    for (var i=0; i<this.datasize_x; i++) {
      for (var j=0; j<this.datasize_y; j++) {
        this.data.push({ x: i, y: j, value: Math.floor((Math.random() * 10))})
      }
    }

  }

  render()
  {
    return (
      <ReactHeatmap max={100} data={this.data} />
    )
  }


}
