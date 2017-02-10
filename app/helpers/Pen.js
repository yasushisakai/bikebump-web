export default class Pen {

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.mouseX = this.mouseY = 0
    this.isNoFill = false
    this.isNoStroke = true
    this.width = this.canvas.width
    this.height = this.canvas.height

    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'bottom'
    this.ctx.font = '12px sans-serif'
    this.strokeWidth(1)

  }

  drawLine(sx, sy, ex, ey) {
    this.ctx.beginPath()
    this.ctx.moveTo(sx, sy)
    this.ctx.lineTo(ex, ey)
    this.ctx.stroke()
  }

  clear(){
    this.ctx.clearRect(0,0,this.width,this.height)
  }

  stroke(color){
    this.isNoStroke = false
    this.ctx.strokeStyle = color
  }

  strokeWidth(width){
    this.ctx.lineWidth = width
  }

  fill(color){
    this.isNoFill = false
    this.ctx.fillStyle = color 
  }

  text(text,x,y){
    if(!this.isNofill)
      this.ctx.fillText(text,x,y)
    if(!this.isNoStroke)
      this.ctx.strokeText(text,x,y)
  }

  noStroke(){
    this.isNoStroke = true
  }

  noFill(){
    this.isNoFill = true
  }

  updateMouse (event) {
    const {x,y} = this.getMouseCoordinates(event)
    this.mouseX = x
    this.mouseY = y
  }

  distance (sx,sy,ex,ey) {
    return Math.sqrt(Math.pow(ex-sx,2)+Math.pow(ey-sy,2))
  }

  drawPolyline(points) {
    this.ctx.beginPath()
    points.map((point, index) => {

      if (index === 0) {
        this.ctx.moveTo(point[0], point[1])
      } else {
        this.ctx.lineTo(point[0], point[1])
      }

    })
    if(!this.isNoStroke) this.ctx.stroke()
    if(!this.isNoFill) this.ctx.fill()
  }

  drawVerticalAxis(x, height) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, 0)
    this.ctx.lineTo(x, height)

    if(!this.isNoStroke)this.ctx.stroke()
    //if(!this.isNoFill)context.fill()
  }

  drawCircle( x, y, radius) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    if(!this.isNoStroke) this.ctx.stroke()
    if(!this.isNoFill) this.ctx.fill()
  }

  getMouseCoordinates(event){
  const rect = this.canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return {x,y}
}



}