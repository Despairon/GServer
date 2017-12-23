const EVENTS_MODULE = 'events'

const EventEmitter = require(EVENTS_MODULE);

const gEvents =
{
    ERROR_OCCURRED:           'error',
    GET_HOMEPAGE_REQUESTED:   'GET_HOMEPAGE_REQUESTED',
    GET_ABOUT_US_REQUESTED:   'GET_ABOUT_US_REQUESTED',
    GET_WHAT_WE_DO_REQUESTED: 'GET_WHAT_WE_DO_REQUESTED',
    GET_CONTACTS_REQUESTED:   'GET_CONTACTS_REQUESTED'
}

class GEventsManager extends EventEmitter
{
    constructor()
    {
        super();
        this.on(gEvents.ERROR_OCCURRED, () => console.error('Error event occurred!!!'));
    }

    registerEvent(event, action)
    {
        this.on(event, action);
    }

    raiseEvent(event, ...args)
    {
        this.emit(event, args);
    }
};

module.exports =
{
    gEvents:        gEvents,
    gEventsManager: () => { return new GEventsManager() }
}