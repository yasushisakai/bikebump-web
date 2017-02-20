import React, { PropTypes } from 'react'
import {insertCSSLink} from 'helpers/utils'

import { MidMapContainer } from 'containers'
import {contents} from 'styles/styles.css'
import {midMapContents, roadInfoContents} from './styles.css'

// fancy 
// http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/

export default function RoadVis (props) {
  insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')
  return (
    <div className={contents}>
      <div className={midMapContents}>
        <MidMapContainer roadId={props.roadId} />
      </div>
      <div className={roadInfoContents}>
        {'roadInfo'}
      </div>
    </div>
  )
}