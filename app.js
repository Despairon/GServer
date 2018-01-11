const CFG_FILENAME       = 'config.json';
const SERVER_MODULE      = './gserver';
const EXPRESS_MODULE     = 'express';
const BODY_PARSER_MODULE = 'body-parser';

let express    = require(EXPRESS_MODULE);
let bodyParser = require(BODY_PARSER_MODULE);
let app        = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let serverModule = require(SERVER_MODULE);
let serverApp    = serverModule.server;

// TODO: wrap everything in try catch

serverApp.init(app, CFG_FILENAME, (initError) =>
{
    if (!initError)
    {
        serverApp.start( (startError) =>
        {
            if (startError)
            {
                console.log('Server start error. DeInit requested');
                serverApp.deInit( ( deInitError ) =>
                {
                    if (deInitError)
                    {
                        console.log('Critical failure.');
                    }
                })
            }
            else
            {
                console.log('Server is running');
            }
        })
    }
    else
    {
        console.log('Server initialization error!');
    }
});

