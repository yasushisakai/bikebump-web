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
    type: string;
    coordinates: Array<Array<number>>;
};

export type MultiLineString = {
    type: string;
    coordinates: Array<Array<Array<number>>>;
};

type RoadGeometry = LineString | MultiLineString;
