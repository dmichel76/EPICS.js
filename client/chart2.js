import React from 'react'
import ReactDOM from 'react-dom'

import EPICSComponent from './epicscomponent.js'
import LineChart from 'react-chartjs/lib/line.js'

module.exports =  class Chart2 extends EPICSComponent {

  constructor(props)
  {
    super(props)

    this.width = (typeof this.props.width == "undefined") ? 300 : this.props.width
    this.height = (typeof this.props.height == "undefined") ? 200 : this.props.height

    this.buffersize = (typeof this.props.buffersize == "undefined") ? 100 : this.props.buffersize

    this.pointcolor = (typeof this.props.pointcolor == "undefined") ? "blue" : this.props.pointcolor
    this.fillcolor = (typeof this.props.fillcolor == "undefined") ? "rgba(255,255,255,0)" : this.props.fillcolor
    this.strokecolor = (typeof this.props.strokecolor == "undefined") ? "blue" : this.props.strokecolor
    this.label = (typeof this.props.label == "undefined") ? "" : this.props.label

    this.data =
    {
      labels: [],
      datasets: [
        {
            label: this.label,
            fillColor: this.fillcolor,
            strokeColor: this.strokecolor,
            pointColor: this.pointcolor,
            pointStrokeColor: this.pointcolor,
            data: [],
        }
      ]
    }

  }

  onChange(pv) {

    const size = this.data.datasets[0].data.length
    if (size >= this.buffersize)
    {
      this.data.datasets[0].data.shift()
      this.data.labels.shift()
    }

    this.data.labels.push('')
    this.data.datasets[0].data.push(pv.val)
  }

  render()
  {
    return (
      <LineChart data={this.data} width={this.width} height={this.height}/>
    )
  }

}
