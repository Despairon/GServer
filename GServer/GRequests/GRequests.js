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

    get_homepage:   {uri: '/',           type: requestTypes.GET},
    get_about_us:   {uri: '/about_us',   type: requestTypes.GET},
    get_what_we_do: {uri: '/what_we_do', type: requestTypes.GET},
    get_contacts:   {uri: '/contacts',   type: requestTypes.GET},

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
    requestTypes: requestTypes,
    requests:     requests
};