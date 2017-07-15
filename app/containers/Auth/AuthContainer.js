// @flow
import React, { PropTypes } from 'react';
import { Auth } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';
import * as usersActionCreators from 'modules/users';
import { services } from 'helpers/auth';
import GoogleIcon from 'react-icons/lib/fa/google';
import GithubIcon from 'react-icons/lib/fa/github';
import FacebookIcon from 'react-icons/lib/fa/facebook';

import {
    loginButton,
    loginIcon,
    text,
} from 'components/Auth/styles.css';

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
  router: Object;
}

function AuthButton ({service, onClick}: AuthButtonProps) {
    let icon;
    let bgColor;

    switch (service) {
    case 'google':
        icon = <GoogleIcon/>;
        break;
    case 'github':
        icon = <GithubIcon />;
        break;
    case 'facebook':
        icon = <FacebookIcon />;
        break;
    }

    return (
        <div className={`pt-button pt-large ${loginButton}`}
            style={{fontSize: '1.2em', lineHeight: '2.5em', fontWeight: 400}} onClick={onClick.bind(this, service)} >
            <div className={loginIcon}> {icon} </div>
            <div className={text}> {`login with ${service}`}</div>
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

        if (this.props.isAuthed) {
            this.props.router.push('/record');
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
