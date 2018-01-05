const EVENTS_MODULE = "../GEvents/gevents";

const events = require(EVENTS_MODULE).gEvents;

const requestTypes =
{
    GET:    "GET",
    POST:   "POST",
    PUT:    "PUT",
    DELETE: "DELETE"
};

const requests =
{
    // <editor-fold desc="Get requests">

    get_homepage:   {url: '/',            type: requestTypes.GET, event: events.GET_HOMEPAGE_REQUESTED},
    get_about_us:   {url: '/about_us',    type: requestTypes.GET, event: events.GET_ABOUT_US_REQUESTED},
    get_what_we_do: {url: '/what_we_do',  type: requestTypes.GET, event: events.GET_WHAT_WE_DO_REQUESTED},
    get_contacts:   {url: '/contacts',    type: requestTypes.GET, event: events.GET_CONTACTS_REQUESTED},
    get_image:      {url: '/img?id=id',   type: requestTypes.GET, event: events.GET_IMAGE_REQUESTED}

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