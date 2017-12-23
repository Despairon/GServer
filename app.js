const SERVER_MODULE      = './gserver';
const EXPRESS_MODULE     = 'express';
const BODY_PARSER_MODULE = 'body-parser';

var express    = require(EXPRESS_MODULE);
var bodyParser = require(BODY_PARSER_MODULE);
var app        = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server    = require(SERVER_MODULE);
var serverApp = server(app);

if (serverApp.init())
    if (serverApp.start())
        console.log('Server is running...');
    else
        console.log('Server start error');
else
    console.log('Server initialization error');