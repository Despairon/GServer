const STATE_MACHINE_MODULE = '../StateMachine/statemachine';

const StateMachine = require(STATE_MACHINE_MODULE);

// <editor-fold desc="State Machine">

class GStateMachine extends StateMachine
{
    constructor(initialState, server)
    {
        super(initialState);

        this.states =
        {
            UNINITIALIZED : 'UNINITIALIZED',
            INITIALIZED   : 'INITIALIZED',
            RUNNING       : 'RUNNING',
            STOPPED       : 'STOPPED'
        }

        this.server = server;
    }

    addTransition()
    {
        super.addTransition(gStates.UNINITIALIZED, server.events.INIT_REQUESTED, gStates.INITIALIZED, fsm_serverInit);
    }

    execute(event, eventData)
    {
        super.execute(event, eventData);
    }

}

// </editor-fold>

// <editor-fold desc="Callbacks">

function fsm_serverInit(data)
{
    // TODO: fsm_serverInit: complete

    // set application
    server.app = data.app;
    // set configuration filename
    server.cfgFile = data.cfgFile;
    // set configuration
    server.config = readJsonFile(server.cfgFile);

    if (server.config == null)
    {
        console.log("Error reading configuration. Using default values");
        server.config = server.getDefaultConfig();
    }

    // register http requests
    server.registerRequests();

    // initialize database
    server.db = GDataBase(server.config.dbName);
    server.db.connect();

    data.cb(false);
}

function fsm_serverStart(data)
{
    // TODO: fsm_serverStart: complete
    let srv = server.app.listen(server.config.port, () =>
    {
        let host = srv.address().address;
        let port = srv.address().port;
        console.log(`Server is started at http://${host}:${port}`);
    } );

    data.cb(false);
}

function fsm_serverStop(data)
{
    // TODO: fsm_stop: complete

    data.cb(false);
}

function fsm_serverDeinit(data)
{
    server.db.disconnect();

    // TODO: fsm_deinit: complete

    data.cb(false);
}

// </editor-fold>

// <editor-fold desc="Miscellanous functions">

function readJsonFile(fileName)
{
    let fs      = require("fs");
    let content = fs.readFileSync(fileName);

    try
    {
        return JSON.parse(content);
    }
    catch (e)
    {
        console.log(`JSON parse error: ${e.name} message:\n${e.message}`);
        return null;
    }
}

// </editor-fold>

module.exports =  function (initialState, server)
{
    return new GStateMachine(initialState, server)
}
