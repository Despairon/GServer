const DEFAULT_PORT    = 8081;
const CFG_FILENAME    = 'GServer/config.json';
const REQUESTS_MODULE = './grequests';
const DATABASE_MODULE = './gdatabase'
const DATABASE_NAME   = 'GDataBase'

function defaultCallback(request, response)
{
    response.send("default cb");
    //TODO: remove after testing
}

class GServer
{
    // <editor-fold desc="Interface members">

    constructor(app)
    {
        this.app  = app;
        this.port = DEFAULT_PORT;
        this.db   = new require(DATABASE_MODULE)(DATABASE_NAME);
    }

    init()
    {

		      let result = true;

		      // set configuration
        var config = this.readJsonFile(CFG_FILENAME);

        if (config != null)
            this.setConfig(config);
        else
            console.log('Config read error, using default values');

        // register http requests
		      this.registerRequests();

		      // initialize database
        this.db.connect();

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
        // TODO: deinit: complete
        this.db.disconnect();
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
	   }

    registerRequests()
    {
        const requestsModule = require(REQUESTS_MODULE);
        let requestTypes     = requestsModule.requestTypes;
        let requests         = requestsModule.requests;

        for (let req in requests)
        {
            switch (requests[req].type)
            {
                // TODO: change default callbacks for appropriates
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

};

module.exports = function(app)
{
    return new GServer(app);
}