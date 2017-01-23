import React from 'react'
import ReactDOM from 'react-dom'

import Colormap from 'colormap'
import EPICSCanvas from './epicscanvas.js'

module.exports =  class Heatmap extends EPICSCanvas {

  constructor(props)
  {
    super(props)

    // dimension
    this.width = (typeof this.props.width == "undefined") ? 300 : this.props.width
    this.height = (typeof this.props.height == "undefined") ? 250 : this.props.height
    this.margin = 20
    this.x = this.margin
    this.y = this.margin
    this.w = this.width - 2.0 * this.margin
    this.h = this.height - 2.0 * this.margin

    // colormap
    this.showcolormap = (typeof this.props.showcolormap == "undefined") ? "yes" : this.props.showcolormap
    this.colormap = (typeof this.props.colormap == "undefined") ? "jet" : this.props.colormap
    this.colormap_nshades = (typeof this.props.colormap_nshades == "undefined") ? 100 : this.props.colormap_nshades
    this.cg = Colormap({ colormap: this.colormap, nshades: this.colormap_nshades, format: 'rgb', alpha: 1 })

    if(this.showcolormap == "yes")
    {
      this.w = this.w - 50
    }

    // fake data
    this.noise = 2
    this.data_size_x = 200
    this.data_size_y = 200
    this.data = this.gaussian(this.data_size_x,this.data_size_y,0,this.noise)

    // resampling to bins
    this.pixel_x = 2
    this.pixel_y = 2
    this.nbinx = Math.ceil(this.w / this.pixel_x)
    this.nbiny = Math.ceil(this.h / this.pixel_y)

    this.resampled = this.resampling(this.data)

  }


  gaussian(lx, ly, random, noise) {

    let a = 200
    let ox = Math.floor(lx / 2) + Math.floor((Math.random() * noise))
    let oy = Math.floor(ly / 2) + Math.floor((Math.random() * noise))
    let sx = Math.floor(lx / 5) + Math.floor((Math.random() * noise))
    let sy = Math.floor(ly / 5) + Math.floor((Math.random() * noise))

    if (random == 1 ) {
      a = Math.floor((Math.random() * 255) + 150)
      ox = Math.floor((Math.random() * lx * 0.5) + lx * 0.2)
      oy = Math.floor((Math.random() * ly * 0.5) + ly * 0.2)
      sx = Math.floor((Math.random() * lx * 0.15) + lx * 0.1)
      sy = Math.floor((Math.random() * ly * 0.15) + ly * 0.1)
    }

    let data = []
    let v = 0
    for (var i=0 ; i<lx ; i=i+1) {
      if (!data[i]) { data[i] = [] }
      for (var j=0 ; j<ly ; j=j+1) {
        data[i][j] = a * Math.exp(-(((i-ox)*(i-ox)/(2*sx*sx))+(((j-oy)*(j-oy)/(2*sy*sy)))))
      }
    }

    return data
  }


  resampling(source)
  {
    // initialise arrays
    let array = []
    let counter = []
    for (let i=0 ; i<this.nbinx ; i++) {
      if (!array[i]) { array[i] = [] }
      if (!counter[i]) { counter[i] = [] }
      for (let j=0 ; j<this.nbiny ; j++) {
        array[i][j] = 0
        counter[i][j] = 0
      }
    }

    // calcualte bin size
    let bin_size_x = this.data_size_x / this.nbinx
    let bin_size_y = this.data_size_y / this.nbiny

    // do the resampling
    for( let i=0 ; i<this.data_size_x ; i++) {
      for( let j=0 ; j<this.data_size_y ; j++) {
        let bin_index_x = parseInt(i/bin_size_x)
        let bin_index_y = parseInt(j/bin_size_y)
        array[bin_index_x][bin_index_y] += source[i][j]
        counter[bin_index_x][bin_index_y]++
      }
    }

    // calculate average
    for( let i=0 ; i<this.nbinx ; i++) {
      for( let j=0 ; j<this.nbiny ; j++) {
        array[i][j] /= counter[i][j]
      }
    }

    return array
  }


  applyColormap(value, min, max, colormap) {
    let bucketSize = (max-min)/colormap.length
    let index = parseInt((value-min)/bucketSize)
    let color = colormap[index]
    return "rgba(" + color + ")"
  }


  getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  onChange(pv) {

    this.data = this.gaussian(this.data_size_x, this.data_size_y, 0, this.noise)
    this.resampled = this.resampling(this.data)

    this.draw(pv)
  }

  draw(pv) {
    super.draw(pv)
    const ctx = this.getCanvasContext()

    for (var i=0; i<this.nbinx; i=i+1)
    {
      for (var j=0; j<this.nbiny; j=j+1)
      {
        ctx.fillStyle = this.applyColormap(this.resampled[i][j], 0, 255, this.cg)
        ctx.fillRect(this.x+i*this.pixel_x, this.y+j*this.pixel_y, this.pixel_x, this.pixel_y)
      }
    }

    if(this.showcolormap == "yes")
    {
      for( var k=0 ; k<this.colormap_nshades ; k++) {
        ctx.fillStyle = "rgba(" + this.cg[k] + ")"
        let x = this.x + this.w + 10
        let y = this.y + k * (this.h/this.colormap_nshades)
        let w = 20
        let h = (this.h/this.colormap_nshades)
        ctx.fillRect(x, y, w, h)
      }

    }

  }


}
