import React from 'react'
import ReactDOM from 'react-dom'

import EPICSCanvas from './epicscanvas.js'
import EPICSComponent from './epicscomponent.js'


module.exports =  class Widget extends EPICSCcomponent {

  constructor(props) {
    super(props)

    // property should be defined like so
    this.myproperty = (typeof this.props.myproperty == "undefined") ? "value" : this.props.myproperty
  }

  render(){
    return (
        <div >
          {this.props.pv} = {this.state.pvvalue}
        </div>
    )
  }
}

module.exports =  class CanvasWidget extends EPICSCanvas {

  constructor(props) {
    super(props)

    // property should be defined like so
    this.myproperty = (typeof this.props.myproperty == "undefined") ? "value" : this.props.myproperty

    // width and height must be defined
    this.width = 100
    this.height = 100

  }

  draw(pv) {

    // initialise the canvas calling the parent draw() method
    super.draw(pv)

    // get the Canvas context so we can draw on it after
    const ctx = this.getCanvasContext()

    // draw widget here
    ctx.beginPath()
    ctx.fillRect()

    // pv value is given by pv.val
    if (pv.val == "some value") {
      // do something specific
    }

  }


}
