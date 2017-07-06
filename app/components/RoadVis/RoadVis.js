// @flow
import React from 'react';

import { MidMapContainer } from 'containers';
import {contents} from 'styles/styles.css';
import {midMapContents, roadInfoContents} from './styles.css';

// fancy
// http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/

type Props={
  roadId: string;
}

export default function RoadVis ({roadId}:Props) {
    return (
        <div className={contents}>
            <div className={midMapContents}>
                <MidMapContainer roadId={roadId} />
            </div>
            <div className={roadInfoContents}>
                {'Choose one proposal for each segment. The influence of one vote is increased by answering surveys (paw button). Costly options will damp your vote.'}
            </div>
        </div>
    );
}
