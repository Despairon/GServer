const SERVER_MODULE = './gserver';

var express = require('express');
var app     = express();

var server    = require(SERVER_MODULE);
var serverApp = server(app);

if (serverApp.init())
    if (serverApp.start())
        console.log('Server is running...');
    else
        console.log('Server start error');
else
    console.log('Server initialization error');