import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

import {Layout} from 'components';

class LayoutContainer extends React.Component {
    componentDidMount () {
        const layoutElement: HTMLElement = document.getElementById('layout');
        const newElement: HTMLDivElement = document.createElement('div');

        newElement.id = 'newElement';
        newElement.style.width = '100%';
        newElement.style.height = '100%';
        layoutElement.appendChild(newElement);
    }

    render () {
        return (
            <Layout />
        );
    }
}

// function mapStateToProps (state) {
//   return {

//   }
// }

// function mapDispatchToProps (dispatch) {
//   return bindActionCreators(,dispatch)
// }

// export default connect(mapStateToProps,
// mapDispatchToProps)(LayoutContainer)

export default LayoutContainer;
