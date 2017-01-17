import React, { PropTypes } from 'react'
import { Auth } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as usersActionCreators from 'modules/users'
import { button } from 'styles/styles.css'
import { services } from 'helpers/auth'

AuthButton.propTypes={
  service: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  //color: PropTypes.string.isRequired,
}

function AuthButton(props){
  return(
    <div 
    className={button} 
    onClick={props.onClick.bind(this,props.service)} >
    {`login with ${props.service} account`}
    </div>
    )
}


const AuthContainer = React.createClass({
  propTypes:{
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    handleFetchAuthUser: PropTypes.func.isRequired,
  },
  handleClick () {
    this.props.handleFetchAuthUser('google')
  },
  signInButtons () {
    return Object.values(services).map((service)=>{
      return <AuthButton 
        onClick={this.props.handleFetchAuthUser}
        service={service}
        key={service} />
    })
  },
  render () {
    return (
      <Auth>
        {this.signInButtons()} 
      </Auth>
    )
  },
})

function mapStateToProps({users}){
  return{
    isFetching : users.get('isFetching'),
    error : users.get('error'),
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(usersActionCreators,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(AuthContainer)