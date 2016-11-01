import React from 'react';
import ReactDOM from 'react-dom';
import {routes} from './routes';

let root = document.getElementById('root');

if(root.requestFullScreen){
    root.requestFullScreen();
}


ReactDOM.render(
    routes,
    root
);
