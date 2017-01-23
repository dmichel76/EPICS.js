import React from 'react'
import ReactDOM from 'react-dom'

import EPICSComponent from './epics.js'

module.exports =  class LedSVG extends EPICSComponent {

  constructor(props) {

    super(props)

    this.size = (typeof this.props.size == "undefined") ? 30 : this.props.size
    this.oncolor = (typeof this.props.oncolor == "undefined") ? "green" : this.props.oncolor
    this.offcolor = (typeof this.props.offcolor == "undefined") ? "red" : this.props.offcolor
    this.strokewidth = (typeof this.props.strokewidth == "undefined") ? 3 : this.props.strokewidth
    this.strokecolor = (typeof this.props.strokecolor == "undefined") ? "grey" : this.props.strokecolor

    this.halfsize = this.size / 2
    this.cx = this.halfsize
    this.cy = this.halfsize
    this.r = this.halfsize - this.strokewidth
  }

  render() {
    return (
      <svg width={this.size} height={this.size}>
         <circle
          cx={this.cx}
          cy={this.cy}
          r={this.r}
          stroke={this.strokecolor}
          strokeWidth={this.strokewidth}
          fill={this.state.pvvalue? this.oncolor : this.offcolor }
          />
      </svg>
    )
  }
}
