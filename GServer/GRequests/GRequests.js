const EVENTS_MODULE = "../GEvents/gevents";

const events = require(EVENTS_MODULE).gEvents;

const requestTypes =
{
    GET:    "get",
    POST:   "post",
    PUT:    "put",
    DELETE: "delete"
};

const requests =
{
    // <editor-fold desc="Get requests">

    get_homepage:     {url: '/',             type: requestTypes.GET, event: events.GET_HOMEPAGE_REQUESTED},
    get_about_us:     {url: '/about_us',     type: requestTypes.GET, event: events.GET_ABOUT_US_REQUESTED},
    get_our_services: {url: '/our_services', type: requestTypes.GET, event: events.GET_OUR_SERVICES_REQUESTED},
    get_our_process:  {url: '/our_process',  type: requestTypes.GET, event: events.GET_OUR_PROCESS_REQUESTED},
    get_contacts:     {url: '/contacts',     type: requestTypes.GET, event: events.GET_CONTACTS_REQUESTED},
    get_image:        {url: '/img',          type: requestTypes.GET, event: events.GET_IMAGE_REQUESTED}

    // </editor-fold>

    // <editor-fold desc="Post requests">

    // </editor-fold>

    // <editor-fold desc="Put requests">

    // </editor-fold>

    // <editor-fold desc="Delete requests">

    // </editor-fold>
};

module.exports =
{
    requests: requests
};