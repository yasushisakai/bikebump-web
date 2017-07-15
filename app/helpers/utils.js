// @flow

import {
    renderTimeConstrain,
    maxCommuteLife,
    dingDetectionGap,
    updateDuration,
} from 'config/constants';

import { Map, List } from 'immutable';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';
import type { RoadGeometry, Question, Ding, Response } from 'types';

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

export function filterStateVariables (key: string | number): boolean {
    return (
        key !== 'isFetching' &&
    key !== 'lastUpdated' &&
    key !== 'error'
    );
}

type Queries = Map<string, List<string>>;
// TODO: write function to extract unanswered respondes
// this is already implemented in RespondContainer.js
// returns Map<dingId, List<qid:string>>>
export function getUnansweredQueries (
    questions: Map<string, Question>,
    userDings: Map<string, Ding>,
    userResponses: Map<string, Response>
): Queries {
    // first get all combinations of questionos - userDings
    let queries: Map<string, List<string>> = new Map();
    userDings.mapKeys((dingId) => {
    // [uid]/[dingId]/[questionId]
    // below is a list of unanswered questions for this ding.
        const tempQuestions = questions.keySeq()
            .filter(key => (key !== 'isFetching' && key !== 'lastUpdated' && key !== 'error'))
            .filter(key => (!userResponses.hasIn([dingId, key])));

        const questionsList = tempQuestions.toList(); // gets rid of key, just the values

        // don't add when this dingId holds no questions
        if (questionsList.size > 0) {
            queries = queries.set(dingId, questionsList);
        }
    });
    return queries;
}

// returns Map<{'dingId': string, 'questionId': string}>
export function pickNewQuery (queries: Queries, isRandom: boolean = false): ?Map<string, string> {
    if (queries.isEmpty()) {
        return null;
    } else {
    // [[dingId, questionId], ... ]
        let flattened: List<List<string>> = List();
        queries.mapKeys(key => {
            queries.get(key).map((qid) => {
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

// returns a new query()
export function removeQuery (queries: Queries, dingId: string, questionId: string): Queries {
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
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
    canvas.width = boundingRect.width;
    canvas.height = boundingRect.height;
}

export function indexToFrequency (index: number, analyser: any): number {
    return index * analyser.binUnit;
}

export function frequencyToIndex (frequency: number, analyser: any): number {
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

export function flipCoordinate (coordArray: Array<number>): Array<number> {
    return coordArray.reverse();
}

export function flipCoordinates (coords: Array<Array<number>>): Array<Array<number>> {
    return coords.map((coord) => flipCoordinate(coord));
}

export function flipGeometry (geometry: RoadGeometry): RoadGeometry {
    if (geometry.type === 'LineString') {
        return {type: 'LineString', coordinates: flipCoordinates(geometry.coordinates)};
    } else {
        const coordinates = geometry.coordinates;
        const newCoordinates = coordinates.map((lineString) => flipCoordinates(lineString));
        return {type: 'MultiLineString', coordinates: newCoordinates};
    }
}

export function spliceRoad (geometry: RoadGeometry, {start, end, index = 0}: {[string]: number}) {
    const totalLength = getSingleLineStringLength(geometry, index);
    let pivot = 0;
    let pivotLength = 0;
    let isInside = false;

    let lineStringCoordinates: Array<Array<number>> = [];

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

export function formatWavFileName (timestamp: number, location: LatLng, value: number|string = 0): string {
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
    return `soundClipsWeb/${timestamp}_${lat}_${lng}_${value}.wav`;
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

export function arrayToLatLng (coordinateArray: Array<number>): LatLng {
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

export function getTotalLength (geometry: RoadGeometry): number {
    let sum: number = 0;

    if (geometry.type === 'LineString') {
        sum = geometry.coordinates.reduce((length, coordinate, index, coordinates) => {
            if (index === 0) return 0;
            else {
                return length + distFromLatLngArray(coordinates[index - 1], coordinate);
            }
        }, 0);
    } else if (geometry.type === 'MultiLineString') {
        sum = geometry.coordinates.reduce((length, lineString) => {
            const lineStringLength = lineString.reduce((partialLength, coordinate, index, coordinates) => {
                if (index === 0) return 0;
                else {
                    return partialLength + distFromLatLngArray(coordinates[index - 1], coordinate);
                }
            }, 0);
            return length + lineStringLength;
        }, 0);
    }

    return sum;
}

export function getSingleLineStringLength (geometry: RoadGeometry, index: number = 0): number {
    if (geometry.type === 'LineString') {
        return getTotalLength(geometry);
    } else {
        const newGeom = {type: 'LineString', coordinates: geometry.coordinates[index]};
        return getTotalLength(newGeom);
    }
}

export function getDomainLength (geometry: RoadGeometry, {index = 0, start, end}: {[string]: number}) {
    const totalLength = getSingleLineStringLength(geometry, index);
    return totalLength * Math.abs(end - start);
}

export function refreshCommute (timestamp: number): boolean {
    return Date.now() - timestamp >= maxCommuteLife;
}

export function clearStorage () {
    localStorage.clear();
    sessionStorage.clear();
}

export function insertAfter (newNode: Node, refNode: Node): void {
    const parentNode = refNode.parentNode;
    if (parentNode) {
        parentNode.insertBefore(newNode, refNode.nextSibling);
    }
}

export function detectionGap (timestamp: number): boolean {
    return Date.now() - timestamp > dingDetectionGap;
}

export function vibrate (duration: number): void {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(duration);
    }
}
