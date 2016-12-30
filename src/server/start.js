let express =require('express');
let path =require('path');
let api_endpoints =require('./api_endpoint');
var bodyParser = require('body-parser');

const app = express();
const isRemote = process.env.REMOTE;
const portNum = 8080;

const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
    secret: 'whataretheoddsofthat',
    cookie: { maxAge: 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: false
}));

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
