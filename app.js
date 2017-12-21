var express = require('express');
var app = express();
var gServer = require('GServer');
var serverApp = gServer(app);

if (serverApp.init())
    if (serverApp.start())
        console.log('Server is running...')
    else
        console.log('Server start error')
else
    console.log('Server initialization error')