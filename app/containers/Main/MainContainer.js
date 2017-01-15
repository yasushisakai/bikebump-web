import React, {PropTypes} from 'react'
import { Main } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as exampleActionCreators from 'modules/example'

const MainContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    error:PropTypes.string.isRequired,
    fetchAndhandleExample:PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.props.fetchAndhandleExample()
  },
  render () {
    return (
      <Main isFetching={this.props.isFetching} error={this.props.error}>
        {this.props.children}
      </Main>
    )
  },
})


// this gets specified parts from the state
// only the parts that this container is interested
function mapStateToProps(state){
  return {
    isFetching: state.example.get('isFetching'),
    error: state.example.get('error'),
  }
}

// connects the reducers 'thunks' functions that returns
// functions with dispatch argument
function mapDispatchToProps(dispatch){
  return bindActionCreators(exampleActionCreators,dispatch) 
}


export default connect(mapStateToProps,mapDispatchToProps)(MainContainer)