// @flow
export type Road = {
    geometry: RoadGeometry;
    properties: any;
};

const unitLineString: LineString = {
  type: 'LineString',
  coordinates: [[0, 0]],
};

export const emptyRoad: Road = {
  geometry: unitLineString,
  properties: {},
};

export type LineString = {
    type: 'LineString';
    coordinates: Array<Array<number>>;
};

export type MultiLineString = {
    type: 'MultiLineString';
    coordinates: Array<Array<Array<number>>>;
};

export type RoadGeometry = LineString | MultiLineString;
