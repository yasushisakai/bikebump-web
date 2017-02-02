import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Admin } from 'components'

const AdminComponents = React.createClass({
  render () {
    return (
      <Admin>
        {this.props.children}
      </Admin>
    )
  },
})

function mapStateToProps (state) {
  return {

  }
}

//function mapDispatchToProps (dispatch) {
//   return bindActionCreators(,dispatch)
// }

export default connect(
  mapStateToProps, 
  //mapDispatchToProps
  )(AdminComponents)