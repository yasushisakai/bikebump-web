// @flow
import React, { PropTypes } from 'react';
import { Auth } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';
import * as usersActionCreators from 'modules/users';
import { button } from 'styles/styles.css';
import { services } from 'helpers/auth';

type AuthButtonProps = {
  service: string;
  onClick: Function;
}

type AuthContainerProps = {
  isFetching: boolean;
  isAuthed: boolean;
  error: string;
  handleUserAuthRedirect: Function;
  handleUserAuthReturn: Function;
}

function AuthButton ({service, onClick}: AuthButtonProps) {
  return (
    <div
      className={button}
      onClick={onClick.bind(this, service)} >
      {`login with ${service} account`}
    </div>
  );
}

class AuthContainer extends React.Component<void, AuthContainerProps, void> {
  constructor (props, context) {
    super(props);
    context.router;
  }

  componentDidMount () {
    if (sessionStorage.getItem('redirectAuth') === 'true') {
      this.props.handleUserAuthReturn();
    }
  }

  componentDidUpdate () {
    this.props.isAuthed
      ? this.context.router.push('record')
      : null;
  }

  signInButtons () {
    const getProvider = () => {
      let getItem: ?string = localStorage.getItem('provider');
      if (typeof getItem === 'string') {
        return getItem;
      } else {
        console.error('no provider found');
        return 'none';
      }
    };

    if (typeof localStorage.getItem('provider') !== 'string') {
      return Object.keys(services).map((key) => {
        // Inigo bug: chrome ver:51.02704, Android ver 5.1.1
        // Object.values is from chrome ver.54 and later
        const service = services[key];
        return <AuthButton
          onClick={this.props.handleUserAuthRedirect}
          service={service}
          key={service} />;
      });
    } else {
      const serviceProvider: string = getProvider();
      return <AuthButton
        service={serviceProvider}
        onClick={this.props.handleUserAuthRedirect}/>;
    }
  }

  render () {
    return (
      <Auth>
        {this.signInButtons()}
      </Auth>
    );
  }
}

AuthContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps ({users}) {
  return {
    isFetching: users.get('isFetching'),
    isAuthed: users.get('isAuthed'),
    error: users.get('error'),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators(usersActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
