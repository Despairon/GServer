const EVENTS_MODULE = 'events';

const EventEmitter = require(EVENTS_MODULE);

const gEvents =
{
    ERROR_OCCURRED:           'error',
    INIT_REQUESTED:           'INIT_REQUESTED',
    START_REQUESTED:          'START_REQUESTED',
    STOP_REQUESTED:           'STOP_REQUESTED',
    DEINIT_REQUESTED:         'DEINIT_REQUESTED',
    GET_HOMEPAGE_REQUESTED:   'GET_HOMEPAGE_REQUESTED',
    GET_ABOUT_US_REQUESTED:   'GET_ABOUT_US_REQUESTED',
    GET_WHAT_WE_DO_REQUESTED: 'GET_WHAT_WE_DO_REQUESTED',
    GET_CONTACTS_REQUESTED:   'GET_CONTACTS_REQUESTED',
    GET_IMAGE_REQUESTED:      'GET_IMAGE_REQUESTED',
    GET_REQUEST_RECEIVED:     'GET_REQUEST_RECEIVED',
    POST_REQUEST_RECEIVED:    'POST_REQUEST_RECEIVED',
    PUT_REQUEST_RECEIVED:     'PUT_REQUEST_RECEIVED',
    DELETE_REQUEST_RECEIVED:  'DELETE_REQUEST_RECEIVED'
};

class GEventsManager extends EventEmitter
{
    constructor()
    {
        super();
        this.on(gEvents.ERROR_OCCURRED, (err) =>
        {
            return console.error(`Error: ${err}`);
        });
    }

    registerEvent(event, action)
    {
        super.on(event, action);
    }

    raiseEvent(event, eventData)
    {
        super.emit(event, eventData);
    }
}

module.exports =
{
    gEvents        : gEvents,
    GEventsManager : function () { return new GEventsManager() }
};