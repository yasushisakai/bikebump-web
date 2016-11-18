import express from 'express';
import path from 'path';
import api_router from './api_routes';

let app = express();
let isRemote = process.env.REMOTE;

// root and static file serving
app.use('/', express.static(path.resolve(__dirname,'../','dist')));

// api
app.use('/api', api_router);

// others, 404 and others will be handled by the app side ./app/routes.js
app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname,'../dist','index.html'));
});

let portNum = 8080; // from the server hosing servers

app.listen(portNum, ()=> {
    console.log((isRemote? 'remote': 'local')+" server on, listening to " + portNum);
});
