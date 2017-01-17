const express = require('express')
const app = express()
const path = require('path')
const RoadHelper = require('./helpers/RoadHelper')

const roadHelper = new RoadHelper()

const isDevelopment = process.argv[2] === 'dev'

const portNum = isDevelopment === true ? 8081 : 8080

const distRoot = path.resolve(__dirname,'../','dist')

app.use(express.static(distRoot))

app.get('/find',(req,res)=>{
  const coordinates = {
    lat:parseFloat(req.query.lat),
    lng:parseFloat(req.query.lng)}
  res.json(roadHelper.findClosest(coordinates))
})

app.get('*',(req,res)=>{
  res.sendFile(path.resolve(distRoot,'index.html'))
})

app.listen(portNum,()=>{
  console.log(`app running in ${portNum}`)
})
