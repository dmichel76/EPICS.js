import React from 'react'
import ReactDOM from 'react-dom'

import Chart from 'chart.js'
import EPICSCanvas from './epicscanvas.js'

module.exports =  class Chart1 extends EPICSCanvas {

  constructor(props) {
    super(props)

    // width and height must be defined
    this.width = 100
    this.height = 100

  }

  draw(pv) {
    // initialise the canvas calling the parent draw() method
    super.draw(pv)

    // get the Canvas context so we can draw on it after
    const ctx = this.getCanvasContext()

    var data = {
        labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [
            {
                data: [65, 59, 80, 81, 56, 55, 40],
            }
        ]
    }

    var myChart = new Chart(ctx, {
        type: 'line',
        data: data
    })

  }

}
