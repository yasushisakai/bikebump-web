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

type LineString = {
    type: string;
    coordinates: Array<Array<number>>;
};

type MultiLineString = {
    type: string;
    coordinates: Array<Array<Array<number>>>;
};

type RoadGeometry = LineString | MultiLineString;
