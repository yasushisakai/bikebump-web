// @flow
import { LatLng } from 'types';

export type Ding = {
    radius: number;
    dingId: string;
    coordinates: LatLng;
    timestamps: {
        [timestamp: number]:BreadCrumbs
    };

    roadId?: number;
    closestRoadPoint?: {
        dist: number; // in meters
        cp: LatLng;
    };
}

export type BreadCrumbs = {
    uid: string;
    value: number;
};
