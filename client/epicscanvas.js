import React from 'react'
import ReactDOM from 'react-dom'

import EPICSComponent from './epicscomponent.js'

import io from 'socket.io-client'
let socket = io('http://localhost:8081/')

module.exports = class EPICSCanvas extends EPICSComponent {

  constructor(props){
    super(props)
  }

  onChange(pv) {
    this.draw(pv)
  }

  draw(pv) {
    this.initCanvas()
    if (this.bb == "yes") { this.drawBoundingBox() }
  }

  initCanvas() {
    this.canvas = this.refs.canvas
    this.ctx = this.canvas.getContext('2d')
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.imageSmoothingEnabled = false
  }

  getCanvas() { return this.canvas }

  getCanvasContext() { return this.ctx }

  getDrawable() {
    return {
      x: this.bbstrokewidth * 0.5,
      y: this.bbstrokewidth * 0.5,
      w: this.width - this.bbstrokewidth,
      h: this.height - this.bbstrokewidth
    }
  }

  drawBoundingBox() {
    this.ctx.beginPath()
    this.ctx.rect(0,0,this.width, this.height)
    this.ctx.lineWidth = this.bbstrokewidth
    this.ctx.strokeStyle = this.bbcolor
    this.ctx.stroke()
  }

  render(){
    return (
      <canvas ref="canvas" width={this.width} height={this.height}/>
    )
  }

}
