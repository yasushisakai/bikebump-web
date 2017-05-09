import React, { PropTypes } from 'react'
import { RecordSound } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as recordSoundActionCreators from 'modules/recordSound'

const RecordSoundContainer = React.createClass({
  propTypes: {
    isRecording: PropTypes.bool.isRequired,

    toggleRecord: PropTypes.func.isRequired,
  },
  handleRecord () {
    console.log('record')
    this.props.toggleRecord()
  },
  render () {
    return (
     <RecordSound
      isRecording={this.props.isRecording}
      handleRecord={this.handleRecord}/>
    )
  },
})

function mapStateToProps ({recordSound}) {
  return {
    isRecording: recordSound.isRecording,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(recordSoundActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordSoundContainer)
