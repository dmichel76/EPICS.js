import React from 'react'
import ReactDOM from 'react-dom'

import EPICSCanvas from './epicscanvas.js'

module.exports =  class Tank extends EPICSCanvas {

  constructor(props) {
    super(props)

    this.width = (typeof this.props.width == "undefined") ? 200 : parseInt(this.props.width)
    this.height = (typeof this.props.height == "undefined") ? 150 : parseInt(this.props.height)
    this.roundradius = (typeof this.props.roundradius == "undefined") ? 5 : parseInt(this.props.roundradius)

    this.foreground = (typeof this.props.foreground == "undefined") ? "blue" : this.props.foreground
    this.foreground2 = (typeof this.props.foreground2 == "undefined") ? "lightgrey" : this.props.foreground2
    this.background = (typeof this.props.background == "undefined") ? "grey" : this.props.background
    this.background2 = (typeof this.props.background2 == "undefined") ? "lightgrey" : this.props.background2
    this.ddd = (typeof this.props.ddd == "undefined") ? "yes" : this.props.ddd

    this.minimum = (typeof this.props.minimum == "undefined") ? 0 : parseInt(this.props.minimum)
    this.maximum = (typeof this.props.maximum == "undefined") ? 100 : parseInt(this.props.maximum)
    this.scale = (typeof this.props.scale == "undefined") ? "yes" : this.props.scale
    this.scalecolor = (typeof this.props.scalecolor == "undefined") ? "black" : this.props.scalecolor
    this.scalefontsize = (typeof this.props.scalefontsize == "undefined") ? 16 : parseInt(this.props.scalefontsize)
    this.scalestep = (typeof this.props.scalestep == "undefined") ? 20 : parseInt(this.props.scalestep)


    // label
    this.text = (typeof this.props.text == "undefined") ? "" : this.props.text
    if (this.text == "${pv}") { this.usepvastext = true }
    this.fontcolor = (typeof this.props.fontcolor == "undefined") ? "black" : this.props.fontcolor
    this.fontsize = (typeof this.props.fontsize == "undefined") ? 20 : parseInt(this.props.fontsize)

  }

  fillRoundedRect(context, x, y, w, h, r){
      context.beginPath();
      context.moveTo(x+r, y);
      context.lineTo(x+w-r, y);
      context.quadraticCurveTo(x+w, y, x+w, y+r);
      context.lineTo(x+w, y+h-r);
      context.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      context.lineTo(x+r, y+h);
      context.quadraticCurveTo(x, y+h, x, y+h-r);
      context.lineTo(x, y+r);
      context.quadraticCurveTo(x, y, x+r, y);
      context.fill();
  }

  draw(pv) {

    super.draw(pv)
    const ctx = this.getCanvasContext()

    ctx.font  = this.scalefontsize.toString().concat("px Georgia")
    this.ticksize = ctx.measureText("-").width
    this.fontheightshift = 0.5 * this.scalefontsize / 1.5

    this.margin_left = 10
    this.margin_right = 10
    this.margin_top = 10
    this.margin_bottom = 10

    if (this.scale == "yes") {
      this.margin_left += 1.5*this.ticksize + ctx.measureText(this.maximum).width
      this.margin_top += this.fontheightshift
      this.margin_bottom += this.fontheightshift
    }

    this.w = this.width - this.margin_left - this.margin_right
    this.h = this.height - this.margin_top - this.margin_bottom
    this.x = this.margin_left
    this.y = this.margin_top

    this.percentage_fill = (pv.val - this.minimum) / (this.maximum - this.minimum)
    this.value_y = this.h * (1.0 - this.percentage_fill) + this.margin_top
    this.value_h = this.h*this.percentage_fill
    if (pv.val < this.minimum) { this.value_h = 0}


    // scale
    if (this.scale == "yes") {

      ctx.beginPath()
      ctx.fillStyle = this.scalecolor
      this.scale_x = this.x-1.5*this.ticksize

      // first place the minimum and maximum limit
      const minimum_y =this.y + this.h
      this.ctx.fillText(this.minimum, this.scale_x - ctx.measureText(this.minimum).width, minimum_y + this.fontheightshift)
      this.ctx.beginPath();
      ctx.strokeStyle = this.scalecolor
      this.ctx.moveTo(this.x, minimum_y)
      this.ctx.lineTo(this.x - this.ticksize, minimum_y)
      this.ctx.lineWidth=1
      this.ctx.stroke()

      const maximum_y =this.y
      this.ctx.fillText(this.maximum, this.scale_x - ctx.measureText(this.maximum).width, maximum_y + this.fontheightshift)
      this.ctx.beginPath()
      ctx.strokeStyle = this.scalecolor
      this.ctx.moveTo(this.x, maximum_y)
      this.ctx.lineTo(this.x - this.ticksize, maximum_y)
      this.ctx.lineWidth=1
      this.ctx.stroke()

      //console.log(this.bla)

      // then place the ticks in between
      //this.scalestep = 30
      for (var i = this.minimum + this.scalestep; i < this.maximum; i=i+this.scalestep) {
        const text = i.toString()
        const percentage = (i - this.minimum) / (this.maximum - this.minimum)
        const position = this.h * (1.0 - percentage) + this.margin_top
        ctx.fillText(text, this.scale_x - ctx.measureText(text).width, position + this.fontheightshift)

        ctx.beginPath()
        ctx.strokeStyle = this.scalecolor
        ctx.moveTo(this.x, position)
        ctx.lineTo(this.x - this.ticksize, position)
        ctx.lineWidth=1
        ctx.stroke()
      }
    }

    // background
    ctx.beginPath()
    if (this.ddd == "yes") {
      this.background_grd = ctx.createLinearGradient(this.x, 0, this.x + this.w , 0)
      this.background_grd.addColorStop(0,this.background)
      this.background_grd.addColorStop(0.25, this.background2)
      this.background_grd.addColorStop(1, this.background)
      ctx.fillStyle = this.background_grd
    }
    else {
      ctx.fillStyle = this.background
    }
    this.fillRoundedRect(ctx, this.x, this.y, this.w, this.h, this.roundradius)
    ctx.clip()

    // foreground
    ctx.beginPath()
    if (this.ddd == "yes") {
      this.fill_grd = ctx.createLinearGradient(this.x, 0, this.x + this.w, 0)
      this.fill_grd.addColorStop(0, this.foreground)
      this.fill_grd.addColorStop(0.25, this.foreground2)
      this.fill_grd.addColorStop(1, this.foreground)
      ctx.fillStyle = this.fill_grd
    }
    else {
      ctx.fillStyle = this.foreground
    }
    this.fillRoundedRect(ctx, this.x, this.value_y, this.w, this.value_h, this.roundradius)

    // label
    ctx.fillStyle = this.fontcolor
    ctx.font = this.fontsize.toString().concat("px Georgia")
    this.text = (this.usepvastext) ? pv.val.toString() : this.text
    this.text_x = this.x + 0.5 * this.w - 0.5 * ctx.measureText(this.text).width
    this.text_y = this.y + 0.5 * this.h + 0.5 * this.fontsize / 1.5
    ctx.fillText(this.text, this.text_x, this.text_y)

  }

}
