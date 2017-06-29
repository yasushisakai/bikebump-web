import React from 'react';
import {label, option, otherresponses} from './styles.css';
import { imgRoot } from 'config/constants';

type Props = {
  size: number;
  label: string;
  background: string;
  color: string;
  otherResponses: number;

  onClick: Function;
}

class Option extends React.Component<void, Props, void> {
  render () {
    let style = {
      width: this.props.size,
      height: this.props.size,
      color: this.props.color,
    };

    console.log(this.props.background);
    if (this.props.background.startsWith('#')) {
      style = {...style, backgroundColor: this.props.background};
    } else {
      style = {
        ...style,
        background: `url(${imgRoot}questionBackgrounds/${this.props.background}.jpg)`,
        backgroundSize: 'cover',
      };
    }

    console.log(this.props.size);

    return (
      <div className={option} onClick={this.props.onClick} style={style}>
        <div className={label}>{this.props.label}</div>
        <div className={otherresponses}>{`(${this.props.otherResponses})`}</div>
      </div>
    );
  }
}

export default Option;
