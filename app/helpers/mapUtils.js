// @flow
import {
    Path,
    polyline,
    Polyline,
    PolylineOptions,
    latLng, LatLng,
    latLngBounds,
    icon,
    Icon,
    point,
    Point,
    LineUtil,
    marker,
    circle,
    CircleMarkerOptions,
    Map,
} from 'leaflet';

import { imgRoot } from 'config/constants';
import { randomColor, flipGeometry } from 'helpers/utils';

import type { Commute, Ding, Road } from 'types';

export const defaultStyle = {
    lineCap: 'butt',
    color: '#f00',
    opacity: 1,
    weight: 1,
    fill: false,
};

export const defaultCircleStyle = {
    ...defaultStyle,
    weight: 10,
    opacity: 0.8,
    color: '#f8e71c',
};

export const defaultRoadStyle = {
    ...defaultStyle,
    color: '#f3f315',
    opacity: 0.8,
    weight: 12,
};

export const roadSelectedStyle = {
    ...defaultStyle,
    color: '#111',
    opacity: 0.8,
    weight: 6,
};

export const defaultCommuteStyle = {
    ...defaultStyle,
    color: '#f8e71c',
    opacity: 0.05,
    weight: 20,
};

export const crossIcon: Icon = icon({
    iconUrl: `${imgRoot}cross.png`,
    iconSize: [5, 5],
    iconAnchor: [3, 3],
    popUpAnchor: [3, 3],
});

let popupStyleButton: Object = {};

popupStyleButton.cursor = 'pointer';
popupStyleButton.padding = '8px';
popupStyleButton.fontSize = '1.5em';
popupStyleButton.border = 'none';
popupStyleButton.backgroundColor = '#fff';

popupStyleButton.color = '#ddd';
export const popUpButtonStyleDisabled = popupStyleButton;
popupStyleButton.color = '#F7D008';
export const popUpButtonStyleEnabled = popupStyleButton;

function latLngToPoint (coordinate: LatLng): Point {
    return point(coordinate.lat, coordinate.lng);
}

export function roadLineStringToLatLngBound (road: Road) {
    let latLngs: LatLng[] = [];
    if (road.geometry.type === 'LineString') {
        latLngs = road.geometry.coordinates;
    } else {
        road.geometry.coordinates.map((lineString) => {
            lineString.map(coordinate => {
                latLngs.push(coordinate);
            });
        });
    }

    return latLngBounds(latLngs);
}

export function getClosestPoint (coordinate: LatLng, road: Road): Point {
    // no need to use leaflet Point,

    let closestDistance = 99999999999999999;
    let closestPoint: ?LatLng = null;

    const basePoint = latLngToPoint(coordinate);

    if (road.geometry.type === 'LineString') {
        road.geometry.coordinates.map((coord, index) => {
            if (index !== 0) {
                const p1 = latLngToPoint(road.geometry.coordinates[index - 1]);
                const p2 = latLngToPoint(coord);

                // FIXME: this leaflet function is cheesy
                const tempDist = LineUtil.pointToSegmentDistance(basePoint, p1, p2);
                if (tempDist < closestDistance) {
                    closestDistance = tempDist;
                    closestPoint = LineUtil.closestPointOnSegment(basePoint, p1, p2);
                }
            }
        });
    } else {
        road.geometry.coordinates.map((coords) => {
            coords.map((coord, index) => {
                if (index !== 0) {
                    const p1 = latLngToPoint(road.geometry.coordinates[index - 1]);
                    const p2 = latLngToPoint(coord);

                    const tempDist = LineUtil.pointToSegmentDistance(basePoint, p1, p2);
                    if (tempDist < closestDistance) {
                        closestDistance = tempDist;
                        closestPoint = LineUtil.closestPointOnSegment(basePoint, p1, p2);
                    }
                }
            });
        });
    }

    let closestDistanceInMeters = latLng(coordinate).distanceTo(closestPoint);

    return {distance: closestDistanceInMeters, point: closestPoint};
}

//
// PLOT functions
//

export function plotRoad (road:Road, _map: Map, customStyle: PolylineOptions, callback: Function): Array<Polyline> {
    const style = {...defaultStyle, opacity: 0.4, weight: 20, ...customStyle};

    const geometry = flipGeometry(road.geometry);

    if (geometry.type === 'LineString') {
    // const coordinates = road.geometry.coordinates.map((coordinate) => [coordinate[1], coordinate[0]]);
        const path = polyline(geometry.coordinates, style).addTo(_map);
        path.addEventListener('click', () => callback(road.properties.id));
        path.addTo(_map);
        return [path];
    } else { // multilineString
        return geometry.coordinates.map((coordinates) => {
            const path = polyline(coordinates, style);
            path.addEventListener('click', () => callback(road.properties.id));
            path.addTo(_map);
            return path;
        });
    }
}

export function plotPolyline (coords: LatLng, _map: Map, customStyle: PolylineOptions): Path {
    const style = {...defaultStyle, opacity: 0.4, weight: 10, color: randomColor(), ...customStyle};
    return polyline(coords, style).addTo(_map);
}

export function plotCommute (commute: Commute, map: Map, customStyle: PolylineOptions = {}): Path {
    const coords = Object.keys(commute)
        .filter(key => key !== 'uid' && key !== 'origin') // snip off uid value
        .sort()
        .map(key => {
            return commute[key];
        });

    polyline(coords, defaultCommuteStyle).addTo(map);
}

export function plotDing (ding: Ding, map: Map, customStyle:CircleMarkerOptions = {}): Path {
    const coords = ding.coordinates;
    const style = {...defaultStyle, clickable: false, interactive: false, weight: 2, opacity: 0.7, ...customStyle};

    const crossMark = marker(coords, {icon: crossIcon, interactive: true, clickable: false}).addTo(map);
    crossMark.addEventListener('click', () => { console.log(ding); });
    if (ding.timestamps) {
        Object.keys(ding.timestamps).map((timestamp, index) => {
            let colored = style;
            if (ding.timestamps[parseInt(timestamp)].value === 0) {
                colored.color = '#d0021b';
            } else {
                colored.color = '#4a90e2';
            }

            circle(coords, 10 + 3 * (index), style).addTo(map);
        });
    }
}
