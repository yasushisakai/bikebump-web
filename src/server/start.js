let express =require('express');
let bodyParser = require('body-parser');
let path =require('path');
let api_endpoints =require('./api_endpoint');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const isRemote = process.env.REMOTE;
const portNum = 8080;


let distRoot = path.resolve(__dirname,'../../dist');

app.use(express.static(distRoot));

/**
 * react app
 */
//app.use('/', express.static(distRoot));


/**
 * API
 */
app.use('/api', api_endpoints);

/**
 * The 404 Not Found
 * send back to react-side to show 404 etc.
 */
app.get('*', (req, res)=> {
    res.sendFile(path.resolve(distRoot,'index.html'));
});


app.listen(portNum, ()=> {
    console.log((isRemote? 'remote': 'local')+" server on, listening to " + portNum);
});
