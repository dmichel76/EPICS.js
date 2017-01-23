import React from 'react'
import ReactDOM from 'react-dom'

// https://www.npmjs.com/package/react-google-charts
import {Chart} from 'react-google-charts'
import EPICSComponent from './epicscomponent.js'

module.exports =  class Gauge extends EPICSComponent {

  constructor(props)
  {
    super(props)

    this.width = (typeof this.props.width == "undefined") ? 300 : this.props.width
    this.height = (typeof this.props.height == "undefined") ? 200 : this.props.height

    this.label = (typeof this.props.label == "undefined") ? this.props.pv : this.props.label
    this.animationspeed = (typeof this.props.animationspeed == "undefined") ? 0 : this.props.animationspeed

    this.minimum = (typeof this.props.minimum == "undefined") ? 0 : this.props.minimum
    this.maximum = (typeof this.props.maximum == "undefined") ? 100 : this.props.maximum

    this.data = [
      [ 'pv', 'value'],
      [ this.label, 70]
    ]

  }

  onChange(pv) {
    this.data.splice(1,1)
    this.data.push([this.label,pv.val])
  }

  render()
  {
    return (
        <Chart chartType="Gauge"
          data={this.data}
          options={{
            width: this.width,
            height: this.height,
            min: this.minimum,
            max: this.maximum,
            animation:{
              duration: this.animationspeed
            },
          }}
          width={this.width}
          height={this.height}
        />
    )
  }

}
