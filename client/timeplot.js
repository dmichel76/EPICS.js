import React from 'react'
import ReactDOM from 'react-dom'

// https://www.npmjs.com/package/react-google-charts
import {Chart} from 'react-google-charts'
import EPICSComponent from './epicscomponent.js'

module.exports =  class Plot extends EPICSComponent {

  constructor(props)
  {
    super(props)

    this.width = (typeof this.props.width == "undefined") ? 300 : this.props.width
    this.height = (typeof this.props.height == "undefined") ? 200 : this.props.height

    this.buffersize = (typeof this.props.buffersize == "undefined") ? 100 : this.props.buffersize
    this.title = (typeof this.props.title == "undefined") ? "" : this.props.title
    this.legend = (typeof this.props.legend == "undefined") ? "bottom" : this.props.legend
    this.color = (typeof this.props.color == "undefined") ? "blue" : this.props.color
    this.background = (typeof this.props.background == "undefined") ? "transparent" : this.props.background
    this.gridcolor = (typeof this.props.gridcolor == "undefined") ? "lightgrey" : this.props.gridcolor
    this.pointsize = (typeof this.props.pointsize == "undefined") ? 0 : this.props.pointsize
    this.pointshape = (typeof this.props.pointshape == "undefined") ? "circle" : this.props.pointshape
    this.linewidth = (typeof this.props.linewidth == "undefined") ? 1 : this.props.linewidth
    this.xlabel = (typeof this.props.xlabel == "undefined") ? "" : this.props.xlabel
    this.ylabel = (typeof this.props.ylabel == "undefined") ? "" : this.props.ylabel
    this.yminimum = (typeof this.props.yminimum == "undefined") ? "" : this.props.yminimum
    this.ymaximum = (typeof this.props.ymaximum == "undefined") ? "" : this.props.ymaximum

    this.data = [
      [ '', this.props.pv],
      [ 0, 0]
    ]

    this.counter = 0

  }

  onChange(pv) {

    if (this.counter == 0) this.data.splice(1,1)

    if (this.data.length >= this.buffersize) this.data.splice(1,1)

    this.data.push([this.counter,pv.val])
    this.counter++

  }

  render()
  {
    return (
        <Chart chartType="LineChart"
          data={this.data}
          options={{
            legend: {position: this.legend},
            backgroundColor: this.background,
            title: this.title,
            series: {
              0: {
                 color: this.color,
                 lineWidth: this.linewidth,
                 pointShape: this.pointshape,
                 pointSize: this.pointsize
                 }
            },
            vAxis:{
                  viewWindowMode:'explicit',
                  viewWindow:{
                    max: this.ymaximum,
                    min: this.yminimum
                  },
                  title: this.ylabel,
                  gridlines:{
                    color: this.gridcolor
                  },
                  baselineColor: 'black'
                  },
            hAxis:{
                  title: this.xlabel,
                  gridlines:{
                     color: this.gridcolor
                  },
                  baselineColor: 'black'
                  },

          }}
          width={this.width}
          height={this.height}
        />
    )
  }

}
