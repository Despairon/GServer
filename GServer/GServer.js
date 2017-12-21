const DEFAULT_PORT = 8081;
const CFG_FILENAME = 'GServer/config.json';


var cb = function (request, response)
{
    response.send("got it");
    //FIXME: remove after testing
}

const GetRequests =
{
    HOMEPAGE:   {name: 'HOMEPAGE',   url: '/',           callback: cb},
    ABOUT_US:   {name: 'ABOUT_US',   url: '/about_us',   callback: cb},
    WHAT_WE_DO: {name: 'WHAT_WE_DO', url: '/what_we_do', callback: cb},
    CONTACTS:   {name: 'CONTACTS',   url: '/contacts',   callback: cb}
};

class GServer
{
    //<editor-fold desc="Interface members">

    constructor(app)
    {
        this.app  = app;
        this.port = DEFAULT_PORT;
    }

    init()
    {
		let result = true;
		
        var config = this.readJsonFile(CFG_FILENAME);

        if (config != null)
            this.setConfig(config);
        else
		{
            console.log('Config read error, using default values');
			result = false;
		}

		this.registerGetRequests();
		
        // TODO: init: complete

        return result;
    }

    start()
    {
        let srv = this.app.listen(this.port, () =>
        {
            let host = srv.address().address;
            let port = srv.address().port;
            console.log(`Server is started at http://${host}:${port}`);
        } );
        return true;
    }

    stop()
    {
        // TODO: stop: implement
        return true;
    }

    deinit()
    {
        // TODO: deinit: implement
        return true;
    }

    // </editor-fold>

    // <editor-fold desc="Class internal logic members">

    readJsonFile(fileName)
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
	
	setConfig(config)
	{
		this.port = config.port;
		// TODO: setConfig: complete
	}

    registerGetRequests()
    {
        for (let req in GetRequests)
            this.app.get(GetRequests[req].url, GetRequests[req].callback);
    }

    // </editor-fold>

}

module.exports = function(app)
{
    return new GServer(app);
}