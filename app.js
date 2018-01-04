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

serverApp.init(app, CFG_FILENAME, (initError) =>
{
    if (!initError)
    {
        serverApp.start( (startError) =>
        {
            if (startError)
            {
                console.log('Server start error. Deinit requested');
                serverApp.deinit( ( deinitError ) =>
                {
                    if (deinitError)
                    {
                        console.log('Critical failure.');
                    }
                })
            }
        })
    }
});

