import React, {PropTypes} from 'react'
import { Main } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { body } from 'styles/styles.css' 


const MainContainer = React.createClass({
  componentDidMount () {
  },
  render () {
    return (
      <Main>
        {this.props.children}
      </Main>
    )
  },
})


export default connect()(MainContainer)