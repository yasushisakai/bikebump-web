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
    isAuthed:PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    handleUserAuthRedirect : PropTypes.func.isRequired,
    handleUserAuthReturn: PropTypes.func.isRequired,
  },
  contextTypes:{
    router: PropTypes.object.isRequired,
  },
  componentDidMount (){
    if(sessionStorage.getItem('redirectAuth') === 'true'){
      this.props.handleUserAuthReturn()
    }
  },
  componentDidUpdate (){
    this.props.isAuthed === true 
    ? this.context.router.push('record')
    : null
  },
  signInButtons () {
    if(localStorage.getItem('provider') === null){
      return Object.values(services).map((service)=>{
        return <AuthButton 
          onClick={this.props.handleUserAuthRedirect}
          service={service}
          key={service} />
      })
    }else{
      return <AuthButton 
        onClick={this.props.handleUserAuthRedirect}
        service={localStorage.getItem('provider')}
        />
    }
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
    isAuthed: users.get('isAuthed'),
    error : users.get('error'),
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(usersActionCreators,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(AuthContainer)
