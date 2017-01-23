import React from 'react'
import ReactDOM from 'react-dom'

import EPICSCanvas from './epicscanvas.js'

module.exports =  class TextUpdate extends EPICSCanvas {

  constructor(props) {
    super(props)

    this.padding = 5
    this.margin = 5

    this.fontcolor = (typeof this.props.fontcolor == "undefined") ? "black" : this.props.fontcolor
    this.fontsize = (typeof this.props.fontsize == "undefined") ? 18 : this.props.fontsize
    this.background = (typeof this.props.background == "undefined") ? "lightgrey": this.props.background

    this.width = (typeof this.props.width == "undefined") ? 100 : this.props.width
    this.height = (typeof this.props.height == "undefined") ? this.fontsize + 2*this.margin + 2*this.padding : this.props.height

    this.pretext = (typeof this.props.pretext == "undefined") ? "" : this.props.pretext
    this.posttext = (typeof this.props.posttext == "undefined") ? "" : this.props.posttext
  }

  draw(pv) {

    super.draw(pv)
    const ctx = this.getCanvasContext()
    ctx.fillStyle = this.background
    ctx.fillRect(this.padding,this.padding,this.width-2*this.padding, this.height-2*this.padding)
    ctx.beginPath()
    ctx.fillStyle = this.fontcolor
    ctx.font = this.fontsize.toString().concat("px Georgia")
    ctx.fillText(this.pretext + pv.val + this.posttext, this.margin+this.padding, 0.5 * this.height + 0.5*this.fontsize/1.5)

  }


}
