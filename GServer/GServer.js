const REQUESTS_MODULE       = './grequests';
const DATABASE_MODULE       = './gdatabase';
const EVENTS_MODULE         = './gevents';
const STATE_MACHINE_MODULE  = './statemachine';
const PATH_MODULE           = 'path';

const StateMachine  = require(STATE_MACHINE_MODULE);
const GRequests     = require(REQUESTS_MODULE);
const GDataBase     = require(DATABASE_MODULE);
const GEvents       = require(EVENTS_MODULE);
const path          = require(PATH_MODULE);

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

        this.db     = null;
        this.app    = null;
        this.server = null;

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
        transition(States.UNINITIALIZED, this.events.INIT_REQUESTED,             States.UNINITIALIZED,  (data) => _this.serverInit(data));
        transition(States.UNINITIALIZED, this.events.DATABASE_CONN_OK,           States.INITIALIZED,    (data) => _this.returnInitResult(data));
        transition(States.UNINITIALIZED, this.events.DATABASE_CONN_ERR,          States.UNINITIALIZED,  (data) => _this.returnInitResult(data));

        // transitions from INITIALIZED
        transition(States.INITIALIZED,   this.events.START_REQUESTED,            States.RUNNING,        (data) => _this.serverStart(data));
        transition(States.INITIALIZED,   this.events.DEINIT_REQUESTED,           States.UNINITIALIZED,  (data) => _this.serverDeinit(data));

        // transitions from RUNNING
        transition(States.RUNNING,       this.events.STOP_REQUESTED,             States.STOPPED,        (data) => _this.serverStop(data));
        transition(States.RUNNING,       this.events.GET_HOMEPAGE_REQUESTED,     States.RUNNING,        (data) => _this.processGetHomepage(data));
        transition(States.RUNNING,       this.events.GET_ABOUT_US_REQUESTED,     States.RUNNING,        (data) => _this.processGetAboutUs(data));
        transition(States.RUNNING,       this.events.GET_OUR_SERVICES_REQUESTED, States.RUNNING,        (data) => _this.processGetOurServices(data));
        transition(States.RUNNING,       this.events.GET_OUR_PROCESS_REQUESTED,  States.RUNNING,        (data) => _this.processGetOurProcess(data));
        transition(States.RUNNING,       this.events.GET_CONTACTS_REQUESTED,     States.RUNNING,        (data) => _this.processGetContacts(data));
        transition(States.RUNNING,       this.events.GET_IMAGE_REQUESTED,        States.RUNNING,        (data) => _this.processGetImage(data));

        // transitions from STOPPED
        transition(States.STOPPED,       this.events.START_REQUESTED,            States.RUNNING,        (data) => _this.serverStart(data));
        transition(States.STOPPED,       this.events.DEINIT_REQUESTED,           States.UNINITIALIZED,  (data) => _this.serverDeinit(data));
    }

    // </editor-fold>

    // <editor-fold desc="FSM callbacks">

    serverInit(data)
    {
        console.log('Server initialization started...');

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
        this.db.connect(this.config.dbPort, (err) =>
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
        this.server = this.app.listen(this.config.port, this.config.ip, () =>
        {
            let host = this.server.address().address;
            let port = this.server.address().port;
            console.log(`Server is started at http://${host}:${port}`);

            data.cb(false);
        } );
    }

    serverStop(data)
    {
        // stop listening on address
        if (this.server != null)
            this.server.close();

        data.cb(this.server != null);
    }

    serverDeinit(data)
    {
        // disconnect database
        this.db.disconnect();

        // deinitialize components
        this.db     = null;
        this.app    = null;
        this.server = null;

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
        this.db.getValue(this.db.collections.TEXT_CONTENT, this.db.documents.HOMEPAGE_CONTENT, (doc) =>
        {
            if (doc !== void(0))
                data.res.json(doc.homepageContent);
            else
                data.res.sendStatus(404);
        });
    }

    processGetAboutUs(data)
    {
        this.db.getValue(this.db.collections.TEXT_CONTENT, this.db.documents.ABOUT_US_CONTENT, (doc) =>
        {
            if (doc !== void(0))
                data.res.json(doc.aboutUsContent);
            else
                data.res.sendStatus(404);
        });
    }

    processGetOurServices(data)
    {
        this.db.getValue(this.db.collections.TEXT_CONTENT, this.db.documents.OUR_SERVICES_CONTENT, (doc) =>
        {
            if (doc !== void(0))
                data.res.json(doc.ourServicesContent);
            else
                data.res.sendStatus(404);
        });
    }

    processGetOurProcess(data)
    {
        this.db.getValue(this.db.collections.TEXT_CONTENT, this.db.documents.OUR_PROCESS_CONTENT, (doc) =>
        {
            if (doc !== void(0))
                data.res.json(doc.ourProcessContent);
            else
                data.res.sendStatus(404);
        });
    }

    processGetContacts(data)
    {
        this.db.getValue(this.db.collections.TEXT_CONTENT, this.db.documents.CONTACTS_CONTENT, (doc) =>
        {
            if (doc !== void(0))
                data.res.json(doc.contactsContent);
            else
                data.res.sendStatus(404);
        });
    }

    processGetImage(data)
    {
        const img_doc = this.db.documents.IMAGE+data.req.query.id;

        this.db.getValue(this.db.collections.IMAGES, img_doc, (img) =>
        {
            if (img !== void(0))
                data.res.sendFile(path.join(__dirname, img.path));
            else
                data.res.sendStatus(404);
        });
    }

    // </editor-fold>

    // <editor-fold desc="Miscellaneous functions">

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
            ip     : "127.0.0.1",
            port   : 8081,
            dbName : "GDataBase",
            dbPort : 27017
        };

        return cfg;
    }

    registerRequests()
    {
        let requests = GRequests.requests;

        for (let _req in requests)
        {
            if (requests.hasOwnProperty(_req))
            {
                if (this.app[requests[_req].type] !== void(0))
                {
                    let _this = this;
                    this.app[requests[_req].type](requests[_req].url, (req, res) =>
                    {
                        const event     = requests[_req].event;
                        const eventData = {event: event, eventData: {req: req, res: res}};
                        _this.eventsManager.raiseEvent(event, eventData);
                    });
                }
                else
                {
                    console.log(`Unsupported request type: ${requests[_req].type}`);
                }
            }
        }

        // register error handler
        this.app.use(function(err, req, res, next) {
            console.error(err.stack);
            res.sendStatus(500);
        });

        // register default '404 not found' response
        this.app.use(function(req, res)
        {
            res.sendStatus(404);
        });
    }

    // </editor-fold>
}

const server = new GServer();

module.exports.server = server;