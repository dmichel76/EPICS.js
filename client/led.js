import React from 'react'
import ReactDOM from 'react-dom'

import EPICSCanvas from './epicscanvas.js'

module.exports =  class Led extends EPICSCanvas {

  constructor(props) {
    super(props)

    this.size = (typeof this.props.size == "undefined") ? 40 : this.props.size
    this.width = this.size
    this.height = this.size

    this.oncolor = (typeof this.props.oncolor == "undefined") ? "green" : this.props.oncolor
    this.oncolor2 = (typeof this.props.oncolor2 == "undefined") ? "white" : this.props.oncolor2
    this.offcolor = (typeof this.props.offcolor == "undefined") ? "red" : this.props.offcolor
    this.offcolor2 = (typeof this.props.offcolor2 == "undefined") ? "white" : this.props.offcolor2
    this.strokewidth = (typeof this.props.strokewidth == "undefined") ? 5 : this.props.strokewidth
    this.strokecolor = (typeof this.props.strokecolor == "undefined") ? "grey" : this.props.strokecolor
    this.strokecolor2 = (typeof this.props.strokecolor2 == "undefined") ? "white" : this.props.strokecolor2

    this.ontext = (typeof this.props.ontext == "undefined") ? "" : this.props.ontext
    this.offtext = (typeof this.props.offtext == "undefined") ? "" : this.props.offtext
    this.fontcolor = (typeof this.props.fontcolor == "undefined") ? "black" : this.props.fontcolor
    this.fontsize = (typeof this.props.fontsize == "undefined") ? 20 : this.props.fontsize

    this.ddd = (typeof this.props.ddd == "undefined") ? "yes" : this.props.ddd

  }

  draw(pv) {

    super.draw(pv)
    const ctx = this.getCanvasContext()

    this.margin = this.bbstrokewidth
    this.halfsize = this.size / 2
    this.cx = this.halfsize
    this.cy = this.halfsize
    this.r = this.halfsize - 0.5 * this.strokewidth - this.margin

    // border
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, 2 * Math.PI)
    ctx.lineWidth = this.strokewidth
    if (this.ddd == "yes")
    {
      this.stroke_grd = ctx.createLinearGradient(this.size*0.7, this.size*0.7, this.size*0.3, this.size*0.3);
      this.stroke_grd.addColorStop(0,this.strokecolor2)
      this.stroke_grd.addColorStop(1,this.strokecolor)
      ctx.strokeStyle = this.stroke_grd
    }
    else {
      ctx.strokeStyle = this.strokecolor;
    }
    ctx.stroke();

    // fill
    this.color = (pv.val == 1) ? this.oncolor : this.offcolor
    if (this.ddd == "yes")
    {
      this.color2 = (pv.val == 1) ? this.oncolor2 : this.offcolor2
      this.fill_grd = ctx.createLinearGradient(this.size*0.7, this.size*0.7, this.size*0.2, this.size*0.2)
      this.fill_grd.addColorStop(0,this.color)
      this.fill_grd.addColorStop(1,this.color2)
      ctx.fillStyle = this.fill_grd
    }
    else {
      ctx.fillStyle = this.color
    }
    ctx.fill()

    // labels
    ctx.clip()
    ctx.fillStyle = this.fontcolor
    ctx.font= this.fontsize.toString().concat("px Georgia")
    this.text = (pv.val == 1) ? this.ontext : this.offtext
    this.text_x = this.cx - 0.5 * ctx.measureText(this.text).width
    this.text_y = this.cy + this.fontsize * 0.5 / 1.5
    ctx.fillText(this.text, this.text_x, this.text_y)

  }


}
