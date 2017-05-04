import {
  minimalLatLngRefresh,
  renderTimeConstrain,
  maxCommuteLife,
  dingDetectionGap,
  updateDuration,
} from 'config/constants'

import axios from 'axios'
import { Map, List } from 'immutable'

export function fetchGeoLocation () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(formatGeoLocation(position.coords))
      },
      (error) => {
        reject(error)
      }, {
        enableHighAccuracy: true,
      })
  })
}

export function formatGoogleStreetViewURL (coordinate, heading = 0) {
  return `https://maps.googleapis.com/maps/api/streetview?size=240x320&location=${coordinate.lat},${coordinate.lng}&heading=${heading}`
}

export function filterStateVariables (key) {
  return (
    key !== 'isFetching' &&
    key !== 'lastUpdated' &&
    key !== 'error'
  )
}

// TODO: write function to extract unanswered respondes
// this is already implemented in RespondContainer.js

export function getUnansweredQueries (questions, userDings, userResponses) {
  // first get all combinations of questionos - userDings
  let combinations = new Map()
  userDings.mapKeys(dingId => {
    const tempQuestions = questions.keySeq()
      // filter irrelavent stuff
      .filter(key => (key !== 'isFetching' && key !== 'lastUpdated' && key !== 'error'))
      // extract ones that is answered userResponses are saved
      // [uid]/[dingId]/[questionId]
      .filter(key => (!userResponses.hasIn([dingId, key])))

    // don't add when this dingId holds no questions
    const questionsList = tempQuestions.toList()
    if (questionsList.size > 0) {
      combinations = combinations.set(dingId, questionsList)
    }
  })
  return combinations
}

export function pickNewQuery (queries, isRandom = false) {
  if (queries.isEmpty()) {
    return null
  } else {
    let flattened = List()
    queries.mapKeys(key => {
      queries.get(key).map(qid => {
        flattened = flattened.push(List([key, qid]))
      })
    })
    let pair
    if (isRandom) {
      pair = flattened.get(Math.floor(Math.random() * flattened.size))
    } else {
      pair = flattened.first()
    }
    return Map({'dingId': pair.first(), 'questionId': pair.last()})
  }
}

export function removeQuery (queries, dingId, questionId) {
  if (queries.has(dingId)) {
    const index = queries.get(dingId).indexOf(questionId)
    if (index < 0) return queries // returning original queries

    if (queries.get(dingId).size < 2) {
      return queries.delete(dingId) // delete the ding, since empty
    } else {
      const newList = queries.get(dingId).delete(index)
      return queries.set(dingId, newList) // delete the index
    }
  } else {
    return queries
  }
}

export function fitCanvas (canvas) {
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  const boundingRect = canvas.getBoundingClientRect()
  canvas.width = boundingRect.width
  canvas.height = boundingRect.height
}

export function indexToFrequency (index, analyser) {
  return index * analyser.binUnit
}

export function frequencyToIndex (frequency, analyser) {
  return Math.round(frequency / analyser.binUnit)
}

export function getCenter (coordinates) {
  return coordinates.reduce((prev, current) => {
    return [prev[0] + current[0], prev[1] + current[1]]
  }, [0, 0]).map((element) => { return element / coordinates.length })
}

export function pointFromParameter (start, end, parameter) {
  const delta = {lat: end.lat - start.lat, lng: end.lng - start.lng}
  return {
    lat: start.lat + delta.lat * parameter,
    lng: start.lng + delta.lng * parameter,
  }
}

export function spliceRoad (geometry, {index = 0, start, end}) {
  const totalLength = getSingleLineStringLength(geometry, index)
  let pivot = 0
  let pivotLength = 0
  let isInside = false

  let lineStringCoordinates

  if (geometry.type === 'LineString') {
    lineStringCoordinates = geometry.coordinates
  } else if (geometry.type === 'MultiLineString') {
    lineStringCoordinates = geometry.coordinates[index]
  }

  let points = []
  let prevCoordinate = lineStringCoordinates[0]
  for (let i = 1; i < lineStringCoordinates.length; i++) {
    // check if im doing it right
    const partialDistance = distFromLatLng(prevCoordinate, lineStringCoordinates[i])
    pivotLength += partialDistance
    const nextPivot = pivotLength / totalLength

    if (!isInside && nextPivot > start) {
      const startPoint = pointFromParameter(prevCoordinate, lineStringCoordinates[i], (start - pivot) / (nextPivot - pivot))
      points.push(startPoint)
      // points.push(lineStringCoordinates[i])
      isInside = true
    }

    if (isInside && nextPivot > end) {
      const lastPoint = pointFromParameter(prevCoordinate, lineStringCoordinates[i], (end - pivot) / (nextPivot - pivot))
      points.push(lastPoint)
      break
    }

    if (isInside) {
      points.push(lineStringCoordinates[i])
    }

    prevCoordinate = lineStringCoordinates[i]
    pivot = nextPivot
  }
  return points
}

export function formatGeoLocation (coords) {
  return {
    lat: coords.latitude,
    lng: coords.longitude,
  }
}

export function getSlopes (dataArray, target, range = 2) {
  const targetValue = dataArray[target]
  let result = [dataArray[target - range], dataArray[target + range]]
  return result.map((value) => (targetValue - value) / range)
}

export function formatUser (name, email, avatar, uid) {
  return {
    name,
    email,
    avatar,
    uid,
  }
}

export function formatWavFileName (timestamp, location) {
  const now = new Date(timestamp)
  const day = zeroAdd(now.getDate())
  const month = zeroAdd(now.getMonth() + 1)
  const year = zeroAdd(now.getFullYear())
  const hour = zeroAdd(now.getHours())
  const minute = zeroAdd(now.getMinutes())
  const seconds = zeroAdd(now.getSeconds())

  const lat = location.lat
  const lng = location.lng

  return `soundClipsWeb/Audio_Sample_${day}-${month}-${year}-${hour}-${minute}-${seconds}_lat=${lat}_long=${lng}.wav`
}

function zeroAdd (num) {
  if (num < 10) return `0${num}`
  else return `${num}`
}

export function updateTimeConstrain (timestamp) {
  return Date.now() - timestamp > renderTimeConstrain
}

export function checkLastUpdate (timestamp, scale = 1) {
  console.warn('check Last Update is deprecated, change to isModuleStale')
  return Date.now() - timestamp > (updateDuration * scale)
}

export function isModuleStale (timestamp, scale = 1) {
  return Date.now() - timestamp > (updateDuration * scale)
}

/**
 * distFromLatLng
 * calculates the distance between two latlng values in Meters
 * ref:
 * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 *
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @returns {number} : distance in METERS
 */
export function distFromLatLng (start, end) {
  const R = 6378.137 * 1000 // Radius of the earth in m
  const dLat = (end.lat - start.lat) * (Math.PI / 180.0)
  const dLon = (end.lng - start.lng) * (Math.PI / 180.0)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.lat * (Math.PI / 180.0)) * Math.cos(end.lat * (Math.PI / 180.0)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in meters

  return d
}

function distFromLatLngArray (start, end) {
  return distFromLatLng({
    lat: start[0],
    lng: start[1],
  }, {
    lat: end[0],
    lng: end[1],
  })
}

export function randomColor () {
  let color = '#'
  for (let i = 0; i < 3; i++) {
    color += ('0' + (Math.floor(256 * Math.random()).toString(16))).slice(-2).toUpperCase()
  }
  return color
}

export function getTotalLength (geometry) {
  if (geometry.type === 'LineString') {
    return geometry.coordinates.reduce((length, coordinate, index, coordinates) => {
      if (index === 0) return 0
      else {
        return length + distFromLatLng(coordinates[index - 1], coordinate)
      }
    }, 0)
  } else if (geometry.type === 'MultiLineString') {
    return geometry.coordinates.reduce((length, lineString) => {
      const lineStringLength = lineString.reduce((partialLength, coordinate, index, coordinates) => {
        if (index === 0) return 0
        else {
          return partialLength + distFromLatLng(coordinates[index - 1], coordinate)
        }
      }, 0)
      return length + lineStringLength
    }, 0)
  }
}

export function getSingleLineStringLength (geometry, index = 0) {
  if (geometry.type === 'LineString') {
    return getTotalLength(geometry)
  } else if (geometry.type === 'MultiLineString') {
    const newGeom = {type: 'LineString', coordinates: geometry.coordinates[index]}
    return getTotalLength(newGeom)
  }
}

export function getDomainLength (geometry, {index = 0, start, end}) {
  const totalLength = getSingleLineStringLength(geometry, index)
  return totalLength * Math.abs(end - start)
}

export function refreshLatLng (timestamp) {
  return Date.now() - timestamp >= minimalLatLngRefresh
}

export function refreshCommute (timestamp) {
  return Date.now() - timestamp >= maxCommuteLife
}

export function clearStorage () {
  localStorage.clear()
  sessionStorage.clear()
}

export function insertAfter (newNode, refNode) {
  refNode.parentNode.insertBefore(newNode, refNode.nextSibling)
}

export function detectionGap (timestamp) {
  return Date.now() - timestamp > dingDetectionGap
}
