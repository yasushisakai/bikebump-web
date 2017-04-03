import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { qwrapper, qtext, qoptions, qoption, items2, items3, items4 } from './styles.css'
const items = [items2, items3, items4]

import * as questionActionCreators from 'modules/questions'


const SurveyContainer = React.createClass({
  propTypes:{
    isFetching : PropTypes.bool.isRequired,
    questionId: PropTypes.string.isRequired,

    onClickOption: PropTypes.func.isRequired, 
  },
  componentDidMount () {
  },
  componentWillUpdate () {
  },
  render () {
    const itemSize = 2
    
    const optionStyle = `${items[itemSize-2]} ${qoption}`

    return (
    <div className={qwrapper}>
      <div className={qtext}>
      { 'a long question blaah blahh blahh' }
      </div>
      <div className={qoptions}>
        <div className={ optionStyle }>{ 'option' }</div>
        <div className={ optionStyle }>{ 'option' }</div>
      </div>
    </div>
    )
  }
})

function mapStateToProps (state,props,) {
  return {
  }
}

//function mapDispatchToProps (dispatch) {
//  return bindActionCreators(,dispatch)
//}

export default connect(mapStateToProps, 
// mapDispatchToProps
)(SurveyContainer)


