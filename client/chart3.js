import React from 'react'
import ReactDOM from 'react-dom'

import EPICSComponent from './epicscomponent.js'

//import {defaults} from 'react-chartjs-2'
//defaults.global.animation = false
import {Line} from 'react-chartjs-2'


module.exports =  class Chart3 extends EPICSComponent {

  constructor(props)
  {
    super(props)

    this.width = (typeof this.props.width == "undefined") ? 300 : this.props.width
    this.height = (typeof this.props.height == "undefined") ? 200 : this.props.height

    this.buffersize = (typeof this.props.buffersize == "undefined") ? 100 : this.props.buffersize

    this.data = {
      labels: [],
      datasets: [
        {
          // fill: false,
          // lineTension: 0.1,
          // backgroundColor: 'rgba(75,192,192,0.4)',
          // borderColor: 'rgba(75,192,192,1)',
          // borderCapStyle: 'butt',
          // borderDash: [],
          // borderDashOffset: 0.0,
          // borderJoinStyle: 'miter',
          // pointBorderColor: 'rgba(75,192,192,1)',
          // pointBackgroundColor: '#fff',
          // pointBorderWidth: 1,
          // pointHoverRadius: 5,
          // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          // pointHoverBorderColor: 'rgba(220,220,220,1)',
          // pointHoverBorderWidth: 2,
          // pointRadius: 1,
          // pointHitRadius: 10,
          data: []
        }
      ]
    };

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
        <Line data={this.data} height={200}
          options={
            {maintainAspectRatio: false}
          }
        />
    )
  }

}
