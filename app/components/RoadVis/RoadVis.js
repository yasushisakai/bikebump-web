import React, { PropTypes } from 'react'

import { MidMapContainer } from 'containers'
import {contents} from 'styles/styles.css'
import {midMapContents, roadInfoContents} from './styles.css'

// fancy 
// http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/

export default function RoadVis (props) {
  return (
    <div className={contents}>
      <div className={midMapContents}>
        <MidMapContainer roadId={props.roadId} />
      </div>
      <div className={roadInfoContents}>
        {'Choose one proposal for each segment. The influence of one vote is increased by answering surveys (paw button). Costly options will damp your vote.'}
      </div>
    </div>
  )
}