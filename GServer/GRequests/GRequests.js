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

    post_homepage:   {uri: '/',           type: requestTypes.POST},
    post_about_us:   {uri: '/about_us',   type: requestTypes.POST},
    post_what_we_do: {uri: '/what_we_do', type: requestTypes.POST},
    post_contacts:   {uri: '/contacts',   type: requestTypes.POST},

    // </editor-fold>

    // <editor-fold desc="Put requests">

    put_homepage:   {uri: '/',           type: requestTypes.PUT},
    put_about_us:   {uri: '/about_us',   type: requestTypes.PUT},
    put_what_we_do: {uri: '/what_we_do', type: requestTypes.PUT},
    put_contacts:   {uri: '/contacts',   type: requestTypes.PUT},

    // </editor-fold>

    // <editor-fold desc="Delete requests">

    delete_homepage:   {uri: '/',           type: requestTypes.DELETE},
    delete_about_us:   {uri: '/about_us',   type: requestTypes.DELETE},
    delete_what_we_do: {uri: '/what_we_do', type: requestTypes.DELETE},
    delete_contacts:   {uri: '/contacts',   type: requestTypes.DELETE}

    // </editor-fold>
};

module.exports =
{
    requestTypes: requestTypes,
    requests:     requests
};