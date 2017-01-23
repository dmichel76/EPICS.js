import React from 'react'
import ReactDOM from 'react-dom'

import rd3 from 'rd3'
import EPICSComponent from './epicscomponent.js'


module.exports =  class Chart5 extends EPICSComponent {

  constructor(props)
  {
    super(props)

    this.width = (typeof this.props.width == "undefined") ? 300 : this.props.width
    this.height = (typeof this.props.height == "undefined") ? 200 : this.props.height

    this.title = (typeof this.props.title == "undefined") ? "" : this.props.title
    this.xaxistitle = (typeof this.props.xaxistitle == "undefined") ? "" : this.props.xaxistitle
    this.yaxistitle = (typeof this.props.yaxistitle == "undefined") ? "" : this.props.yaxistitle
    this.legend = (typeof this.props.legend == "undefined") ? "false" : this.props.legend


    this.buffersize = (typeof this.props.buffersize == "undefined") ? 100 : this.props.buffersize

    this.counter = 0

    this.lineData = [
     {
       name: this.props.pv,
       values: [ {x: "", y: ""} ],
       strokeWidth: 3,
     }
   ]

  }

  onChange(pv) {

    const size = this.lineData[0].values.length
    if (size >= this.buffersize)
    {
       this.lineData[0].values.shift()
    }

    this.lineData[0].values.push({x: this.counter, y: pv.val})
    this.counter ++
  }

  render()
  {

    var LineChart = rd3.LineChart

    return (
      <LineChart
        legend={false}
        data={this.lineData}
        width={this.width}
        height={this.height}
        title={this.title}
        yAxisLabel={this.yaxistitle}
        xAxisLabel={this.xaxistitle}
        //domain={{x: [,6], y: [-10,]}}
        gridHorizontal={false}
        gridVertical={false}
      />
    )
  }

}
