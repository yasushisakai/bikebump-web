var React = require('react');
var Question = require('./Question');
var Option = require('./Option');

function Main(){
  return(
    <Question text="question text">
      <Option text="option 0"/>
      <Option text="option 1"/>
      <Option text="option 2"/>
      <Option text="option 3"/>
    </Question>
  );
}

module.exports = Main;
