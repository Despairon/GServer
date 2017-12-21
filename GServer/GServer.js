class GServer
{
    //<editor-fold desc="Interface members">

    constructor(app)
    {
        const DEFAULT_PORT = 8081;

        this.app  = app;
        this.port = DEFAULT_PORT;
    }

    init()
    {
        return true;
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
        return true;
    }

    deinit()
    {
        return true;
    }

    // </editor-fold>

    // <editor-fold desc="Class internal logic members">

    // </editor-fold>

}

module.exports = function(app)
{
    return new GServer(app);
}