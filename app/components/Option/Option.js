import React from 'react';
import {label, option, otherresponses} from './styles.css';

type Props = {
    id: string;
    label: string;

    onClick: Function;
}

class Option extends React.Component<void, Props, void> {
  componentDidMount () {
    this.height = document.getElementById().clientHeight;
    this.width = document.getElementById();
  }

    height: number;
    width: number;

    render () {
    return (
      <div className={option} onClick={this.props.onClick}>
        <div className={label}>{this.props.label}</div>
        <div className={otherresponses}>{this.props.otherresponses}</div>
      </div>
    );
  }
}

export default Option;
