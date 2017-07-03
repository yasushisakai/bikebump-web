// @flow

import {
  renderTimeConstrain,
  maxCommuteLife,
  dingDetectionGap,
  updateDuration,
} from 'config/constants';

import { Map, List } from 'immutable';

import { pickBy, isFunction } from 'lodash';
import type { LineString, MultiLineString } from 'types';

import { latLng, LatLng } from 'leaflet';

export function extractActionCreators (itemAction: any) {
  return pickBy(itemAction, isFunction);
}

export function fetchGeoLocation (): Promise<LatLng> {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(formatGeoLocation(position.coords));
      },
      (error) => {
        reject(error);
      }, {
        enableHighAccuracy: true,
      });
  });
}

export function formatGoogleStreetViewURL (coordinate: latLng, heading:number = 0): string {
  return `https://maps.googleapis.com/maps/api/streetview?size=240x320&location=${coordinate.lat},${coordinate.lng}&heading=${heading}`;
}

export function filterStateVariables (key: string): boolean {
  return (
    key !== 'isFetching' &&
    key !== 'lastUpdated' &&
    key !== 'error'
  );
}

// TODO: write function to extract unanswered respondes
// this is already implemented in RespondContainer.js

export function getUnansweredQueries (questions, userDings: Map<any, any>, userResponses) {
  // first get all combinations of questionos - userDings
  let combinations = new Map();
  userDings.mapKeys(dingId => {
    const tempQuestions = questions.keySeq()
      // filter irrelavent stuff
      .filter(key => (key !== 'isFetching' && key !== 'lastUpdated' && key !== 'error'))
      // extract ones that is answered userResponses are saved
      // [uid]/[dingId]/[questionId]
      .filter(key => (!userResponses.hasIn([dingId, key])));

    // don't add when this dingId holds no questions
    const questionsList = tempQuestions.toList();
    if (questionsList.size > 0) {
      combinations = combinations.set(dingId, questionsList);
    }
  });
  return combinations;
}

export function pickNewQuery (queries, isRandom = false) {
  if (queries.isEmpty()) {
    return null;
  } else {
    let flattened = List();
    queries.mapKeys(key => {
      queries.get(key).map(qid => {
        flattened = flattened.push(List([key, qid]));
      });
    });
    let pair;
    if (isRandom) {
      pair = flattened.get(Math.floor(Math.random() * flattened.size));
    } else {
      pair = flattened.first();
    }
    return Map({'dingId': pair.first(), 'questionId': pair.last()});
  }
}

export function removeQuery (queries, dingId, questionId) {
  if (queries.has(dingId)) {
    const index = queries.get(dingId).indexOf(questionId);
    if (index < 0) return queries; // returning original queries

    if (queries.get(dingId).size < 2) {
      return queries.delete(dingId); // delete the ding, since empty
    } else {
      const newList = queries.get(dingId).delete(index);
      return queries.set(dingId, newList); // delete the index
    }
  } else {
    return queries;
  }
}

export function fitCanvas (canvas: HTMLCanvasElement): void {
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const boundingRect = canvas.getBoundingClientRect();
  canvas.width = boundingRect.width;
  canvas.height = boundingRect.height;
}

export function indexToFrequency (index: number, analyser): number {
  return index * analyser.binUnit;
}

export function frequencyToIndex (frequency: number, analyser): number {
  return Math.round(frequency / analyser.binUnit);
}

export function getCenter (coordinates: LatLng[]): LatLng {
  return coordinates.reduce((prev, current) => {
    return [prev[0] + current[0], prev[1] + current[1]];
  }, [0, 0]).map((element) => { return element / coordinates.length; });
}

export function pointFromParameter (start: LatLng, end: LatLng, parameter: number): LatLng {
  const delta: LatLng = {lat: end.lat - start.lat, lng: end.lng - start.lng};
  return {
    lat: start.lat + delta.lat * parameter,
    lng: start.lng + delta.lng * parameter,
  };
}

export function flipCoordinate(coordArray: number[]): number[]{
  return coordArray.reverse();
}

export function flipCoordinates(coords: number[][]): number[][]{
  return coords.map((coord) => flipCoordinate(coord))
}

type Geometry = LineString | MultiLineString;

export function flipGeometry(geometry: Geometry): Geometry{
  if (geometry.type === 'LineString' ) {
    return {...geometry, coordinates:flipCoordinates(geometry.coordinates)};
  } else {
    const coordinates = geometry.coordinates;
    const newCoordinates = coordinates.map((lineString) => flipCoordinates(lineString));
    return {...geometry, coordinates:newCoordinates};
  }
}

export function spliceRoad (geometry: Geometry, {start, end, index=0}) {
  const totalLength = getSingleLineStringLength(geometry, index);
  let pivot = 0;
  let pivotLength = 0;
  let isInside = false;

  let lineStringCoordinates;

  if (geometry.type === 'LineString') {
    lineStringCoordinates = geometry.coordinates;
  } else if (geometry.type === 'MultiLineString') {
    lineStringCoordinates = geometry.coordinates[index];
  }

  let points: LatLng[] = [];
  let prevCoordinate: LatLng = arrayToLatLng(lineStringCoordinates[0]);
  for (let i = 1; i < lineStringCoordinates.length; i++) {
    // check if im doing it right
    const currCoordinate: LatLng = arrayToLatLng(lineStringCoordinates[i]);
    const partialDistance = distFromLatLng(prevCoordinate, currCoordinate);
    console.log(partialDistance);
    pivotLength += partialDistance;
    const nextPivot = pivotLength / totalLength;

    if (!isInside && nextPivot > start) {
      const startPoint = pointFromParameter(prevCoordinate, currCoordinate, (start - pivot) / (nextPivot - pivot));
      points.push(startPoint);
      // points.push(lineStringCoordinates[i])
      isInside = true;
    }

    if (isInside && nextPivot > end) {
      const lastPoint = pointFromParameter(prevCoordinate, currCoordinate, (end - pivot) / (nextPivot - pivot));
      points.push(lastPoint);
      break;
    }

    if (isInside) {
      points.push(currCoordinate);
    }

    prevCoordinate = currCoordinate;
    pivot = nextPivot;
  }
  return points;
}

export function formatGeoLocation (coords: {latitude: number, longitude: number}): LatLng {
  return {
    lat: coords.latitude,
    lng: coords.longitude,
  };
}

export function getSlopes (dataArray: Uint8Array, target: number, range: number = 2) {
  const targetValue = dataArray[target];
  let result = [dataArray[target - range], dataArray[target + range]];
  return result.map((value) => (targetValue - value) / range);
}

export function formatUser (name: string, email: string, avatar: string, uid: string) {
  return {
    name,
    email,
    avatar,
    uid,
  };
}

export function formatWavFileName (timestamp: number, location: LatLng): string {
  // const now = new Date(timestamp)
  // const day = zeroAdd(now.getDate())
  // const month = zeroAdd(now.getMonth() + 1)
  // const year = zeroAdd(now.getFullYear())
  // const hour = zeroAdd(now.getHours())
  // const minute = zeroAdd(now.getMinutes())
  // const seconds = zeroAdd(now.getSeconds())

  const lat = location.lat;
  const lng = location.lng;

  // return `soundClipsWeb/${day}-${month}-${year}-${hour}-${minute}-${seconds}_lat=${lat}_long=${lng}.wav`
  return `soundClipsWeb/${timestamp}_${lat}_${lng}.wav`;
}

export function updateTimeConstrain (timestamp: number): boolean {
  return Date.now() - timestamp > renderTimeConstrain;
}

export function checkLastUpdate (timestamp: number, scale: number = 1): boolean {
  console.warn('check Last Update is deprecated, change to isModuleStale');
  return Date.now() - timestamp > (updateDuration * scale);
}

export function isModuleStale (timestamp: number, scale: number = 1): boolean {
  return Date.now() - timestamp > (updateDuration * scale);
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
export function distFromLatLng (start: LatLng, end: LatLng): number {
  const R = 6378.137 * 1000; // Radius of the earth in m
  const dLat = (end.lat - start.lat) * (Math.PI / 180.0);
  const dLon = (end.lng - start.lng) * (Math.PI / 180.0);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.lat * (Math.PI / 180.0)) * Math.cos(end.lat * (Math.PI / 180.0)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in meters

  return d;
}

function distFromLatLngArray (coord0: number[], coord1: number[]): number {
  return distFromLatLng(arrayToLatLng(coord0), arrayToLatLng(coord1));
}

function arrayToLatLng (coordinateArray: Array<number, 2>): LatLng {
  // assuming [lng, lat];
  return {lng: coordinateArray[0], lat: coordinateArray[1]};
}

export function randomColor () {
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += ('0' + (Math.floor(256 * Math.random()).toString(16))).slice(-2).toUpperCase();
  }
  return color;
}

export function getTotalLength (geometry) {
  if (geometry.type === 'LineString') {
    return geometry.coordinates.reduce((length, coordinate, index, coordinates) => {
      if (index === 0) return 0;
      else {
        return length + distFromLatLngArray(coordinates[index - 1], coordinate);
      }
    }, 0);
  } else if (geometry.type === 'MultiLineString') {
    return geometry.coordinates.reduce((length, lineString) => {
      const lineStringLength = lineString.reduce((partialLength, coordinate, index, coordinates) => {
        if (index === 0) return 0;
        else {

          return partialLength + distFromLatLngArray(coordinates[index - 1], coordinate);
        }
      }, 0);
      return length + lineStringLength;
    }, 0);
  }
}

export function getSingleLineStringLength (geometry, index = 0) {
  if (geometry.type === 'LineString') {
    return getTotalLength(geometry);
  } else if (geometry.type === 'MultiLineString') {
    const newGeom = {type: 'LineString', coordinates: geometry.coordinates[index]};
    return getTotalLength(newGeom);
  }
}

export function getDomainLength (geometry, {index = 0, start, end}) {
  const totalLength = getSingleLineStringLength(geometry, index);
  return totalLength * Math.abs(end - start);
}

export function refreshLatLng (timestamp) {
  return Date.now() - timestamp >= minimalLatLngRefresh;
}

export function refreshCommute (timestamp) {
  return Date.now() - timestamp >= maxCommuteLife;
}

export function clearStorage () {
  localStorage.clear();
  sessionStorage.clear();
}

export function insertAfter (newNode, refNode) {
  refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
}

export function detectionGap (timestamp) {
  return Date.now() - timestamp > dingDetectionGap;
}
