const REQUESTS_MODULE       = './grequests';
const DATABASE_MODULE       = './gdatabase';
const EVENTS_MODULE         = './gevents';
const GSTATE_MACHINE_MODULE = './gstatemachine';

const GRequests     = require(REQUESTS_MODULE);
const GDataBase     = require(DATABASE_MODULE);
const GEvents       = require(EVENTS_MODULE);
const GStateMachine = require(GSTATE_MACHINE_MODULE);

class GServer
{
    // <editor-fold desc="Interface members">

    constructor()
    {
        this.stateMachine  = GStateMachine;
        this.events        = GEvents.gEvents;
        this.eventsManager = GEvents.gEventsManager;

        this.db  = null;
        this.app = null;

        let _this = this;

        this.eventsManager.registerEvent(this.events.INIT_REQUESTED,   (e,d) => _this.stateMachine.execute(e, d) );
        this.eventsManager.registerEvent(this.events.START_REQUESTED,  (e,d) => _this.stateMachine.execute(e, d) );
        this.eventsManager.registerEvent(this.events.STOP_REQUESTED,   (e,d) => _this.stateMachine.execute(e, d) );
        this.eventsManager.registerEvent(this.events.DEINIT_REQUESTED, (e,d) => _this.stateMachine.execute(e, d) );
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

    deinit(cb)
    {
        const eventData = {event: this.events.DEINIT_REQUESTED, eventData: {cb : cb}};
        this.eventsManager.raiseEvent(this.events.DEINIT_REQUESTED, eventData);
    }

    // </editor-fold>

    // <editor-fold desc="Class internal logic members">

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
        let requestTypes = GRequests.requestTypes;
        let requests     = GRequests.requests;

        for (let req in requests)
        {
            switch (requests[req].type)
            {
                case requestTypes.GET:
                    this.app.get(requests[req].uri, defaultCallback);
                    break;
                case requestTypes.POST:
                    this.app.post(requests[req].uri, defaultCallback);
                    break;
                case requestTypes.PUT:
                    this.app.put(requests[req].uri, defaultCallback);
                    break;
                case requestTypes.DELETE:
                    this.app.delete(requests[req].uri, defaultCallback);
                    break;
                default:
                    console.log(`Unsupported request type: ${requests[req].type}`);
            }
        }
    }

    // </editor-fold>
}

const server = new GServer();

module.exports.server = server;