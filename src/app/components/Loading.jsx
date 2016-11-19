/**
 * bikebump
 * Loading.jsx
 * by yasushisakai
 * 10/13/16
 */

import React from 'react'


var styles = {

  // possible spinner to be implemented
  // loader: {
  //   border: '16px solid #f3f3f3',
  //   borderRadius: '50%',
  //   borderTopWidth: '16px solid #3498db',
  //   width: '120px',
  //   height: '120px',
  //   webkitAnimation: 'spin 2s linear infinite',
  //   animation: 'spin 2s linear infinite',
  // },

    text: {
    color: "#51E36A"
  },
  content: {
    paddingTop: "50px",
    paddingLeft: "50px"
  },
  image: {
    paddingLeft: "80px"
  }
};

/**
 * Loading Stateless Function
 */
export default function Loading(props) {

    return (
        <div style = {styles.content}>
            <h1 >Loading <span style = {styles.text}> BikeBump...</span> </h1>
            <img style = {styles.image} src={'http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat-one-color/128/bike-icon.png'}/>

        </div>
    );
};

Loading.propTypes = {
    text:React.PropTypes.string.isRequired
};

Loading.defaultProps = {
    text:' '
};
