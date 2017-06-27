// @flow
import type { LatLng } from 'types';

export type Commute = {
    [timestamp: string]: LatLng;
    uid: string;
};

