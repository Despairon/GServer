const REQUESTS_MODULE       = './grequests';
const DATABASE_MODULE       = './gdatabase';
const EVENTS_MODULE         = './gevents';
const STATE_MACHINE_MODULE  = './statemachine';

const StateMachine  = require(STATE_MACHINE_MODULE);
const GRequests     = require(REQUESTS_MODULE);
const GDataBase     = require(DATABASE_MODULE);
const GEvents       = require(EVENTS_MODULE);

const States =
{
    UNINITIALIZED : 'UNINITIALIZED',
    INITIALIZED   : 'INITIALIZED',
    RUNNING       : 'RUNNING',
    STOPPED       : 'STOPPED'
};

class GServer
{
    // <editor-fold desc="GServer core">

    constructor()
    {
        this.state         = States.UNINITIALIZED;
        this.stateMachine  = StateMachine(this.state);
        this.events        = GEvents.gEvents;
        this.eventsManager = GEvents.GEventsManager();

        this.db  = null;
        this.app = null;

        this.registerEvents();

        this.fillTransitions();
    }

    registerEvents()
    {
        let _this = this;

        for (let event in this.events)
            if (this.events.hasOwnProperty(event))
                this.eventsManager.registerEvent(this.events[event], (evData) => _this.stateMachine.execute(evData));


    }

    init(app, cfgFile, cb)
    {
        const eventData = {event: this.events.INIT_REQUESTED, eventData: {app: app, cfgFile: cfgFile, cb : cb}};
        this.eventsManager.raiseEvent(this.events.INIT_REQUESTED, eventData);
    }

    start(cb)
    {
        const eventData = {event: this.events.START_REQUESTED, eventData: {cb : cb} };
        this.eventsManager.raiseEvent(this.events.START_REQUESTED, eventData);
    }

    stop(cb)
    {
        const eventData = {event: this.events.STOP_REQUESTED, eventData: {cb : cb}};
        this.eventsManager.raiseEvent(this.events.STOP_REQUESTED, eventData);
    }

    deInit(cb)
    {
        const eventData = {event: this.events.DEINIT_REQUESTED, eventData: {cb : cb}};
        this.eventsManager.raiseEvent(this.events.DEINIT_REQUESTED, eventData);
    }

    // </editor-fold>

    // <editor-fold desc="FSM transitions">

    fillTransitions()
    {
        let _this = this;

        let transition = function(currState, event, nextState, cb)
        {
            _this.stateMachine.addTransition(currState, event, nextState, cb);
        };

        // transitions from UNINITIALIZED
        transition(States.UNINITIALIZED, this.events.INIT_REQUESTED,           States.UNINITIALIZED,  (data) => _this.serverInit(data));
        transition(States.UNINITIALIZED, this.events.DATABASE_CONN_OK,         States.INITIALIZED,    (data) => _this.returnInitResult(data));
        transition(States.UNINITIALIZED, this.events.DATABASE_CONN_ERR,        States.UNINITIALIZED,  (data) => _this.returnInitResult(data));

        // transitions from INITIALIZED
        transition(States.INITIALIZED,   this.events.START_REQUESTED,          States.RUNNING,        (data) => _this.serverStart(data));
        transition(States.INITIALIZED,   this.events.DEINIT_REQUESTED,         States.UNINITIALIZED,  (data) => _this.serverDeinit(data));

        // transitions from RUNNING
        transition(States.RUNNING,       this.events.STOP_REQUESTED,           States.STOPPED,        (data) => _this.serverStop(data));
        transition(States.RUNNING,       this.events.GET_HOMEPAGE_REQUESTED,   States.RUNNING,        (data) => _this.processGetHomepage(data));
        transition(States.RUNNING,       this.events.GET_ABOUT_US_REQUESTED,   States.RUNNING,        (data) => _this.processGetAboutUs(data));
        transition(States.RUNNING,       this.events.GET_WHAT_WE_DO_REQUESTED, States.RUNNING,        (data) => _this.processGetWhatWeDo(data));
        transition(States.RUNNING,       this.events.GET_CONTACTS_REQUESTED,   States.RUNNING,        (data) => _this.processGetContacts(data));
        transition(States.RUNNING,       this.events.GET_IMAGE_REQUESTED,      States.RUNNING,        (data) => _this.processGetImage(data));

        // transitions from STOPPED
        transition(States.STOPPED,       this.events.START_REQUESTED,          States.RUNNING,        (data) => _this.serverStart(data));
        transition(States.STOPPED,       this.events.DEINIT_REQUESTED,         States.UNINITIALIZED,  (data) => _this.serverDeinit(data));
    }

    // </editor-fold>

    // <editor-fold desc="FSM callbacks">

    serverInit(data)
    {
        // set application
        this.app = data.app;
        // set configuration filename
        this.cfgFile = data.cfgFile;
        // set configuration
        this.config = this.readJsonFile(this.cfgFile);

        if (this.config == null)
        {
            console.log("Error reading configuration. Using default values");
            this.config = this.getDefaultConfig();
        }

        // register http requests
        this.registerRequests();

        // initialize database
        this.db = GDataBase(this.config.dbName);
        this.db.connect( (err) =>
        {
            let event = undefined;
            if (err == null)
                event = this.events.DATABASE_CONN_OK;
            else
                event = this.events.DATABASE_CONN_ERR;

            const eventData = {event: event, eventData: {dbErr: err, cb : data.cb}};
            this.eventsManager.raiseEvent(event, eventData);
        });
    }

    serverStart(data)
    {
        let srv = this.app.listen(this.config.port, () =>
        {
            let host = srv.address().address;
            let port = srv.address().port;
            console.log(`Server is started at http://${host}:${port}`);
        } );

        data.cb(false);
    }

    serverStop(data)
    {
        // TODO: fsm_stop: complete

        data.cb(false);
    }

    serverDeinit(data)
    {
        this.db.disconnect();

        // TODO: fsm_deInit: complete

        data.cb(false);
    }

    returnInitResult(data)
    {
        if (data.dbErr == null)
        {
            // database connection ok
            data.cb(false);
        }
        else
        {
            // database connection err
            data.cb(true);
        }
    }

    processGetHomepage(data)
    {
        data.res.send(data.req.method + ' ' + data.req.originalUrl);
        // TODO: processGetHomepage: implement
    }
    processGetAboutUs(data)
    {
        data.res.send(data.req.method + ' ' + data.req.originalUrl);
        // TODO: processGetAboutUs: implement
    }

    processGetWhatWeDo(data)
    {
        data.res.send(data.req.method + ' ' + data.req.originalUrl);
        // TODO: processGetWhatWeDo: implement
    }

    processGetContacts(data)
    {
        data.res.send(data.req.method + ' ' + data.req.originalUrl);
        // TODO: processGetContacts: implement
    }

    processGetImage(data)
    {
        data.res.send(`Image requested: ${data.req.params.id}`);
        // TODO: processGetImage: implement
    }

    // </editor-fold>

    // <editor-fold desc="Miscellanous functions">

    readJsonFile(fileName)
    {
        if (fileName !== void(0))
        {
            let fs = require("fs");
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
        else return null;
    }

    getDefaultConfig()
    {
        let cfg =
        {
            port   : 8081,
            dbName : "GDataBase"
        };

        return cfg;
    }

    registerRequests()
    {
        let requests = GRequests.requests;

        let _this = this;

        // register middleware
        this.app.use(function (req, res, next)
        {
            for (let _req in requests)
            {
                // TODO: need fixes
                if (requests.hasOwnProperty(_req))
                {
                    if ((requests[_req].url  === req.originalUrl)
                    &&  (requests[_req].type === req.method))
                    {
                        const event = requests[_req].event;
                        const eventData = {event: event, eventData: {req: req, res: res}};
                        _this.eventsManager.raiseEvent(event, eventData);
                    }
                }
            }

            next();
        });

        // TODO: register default ' 404 not found' response to other requests
    }

    // </editor-fold>
}

const server = new GServer();

module.exports.server = server;