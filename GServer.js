class GServer
{
    constructor(app)
    {
        this.app = app;
    }

    init()
    {
        console.log('init called');
        return true;
    }

    start()
    {
        app.listen();
        console.log('start called');
        return true;
    }

    stop()
    {
        console.log('stop called');
        return true;
    }

    deinit()
    {
        console.log('deinit called');
        return true;
    }
}

module.exports = function(app)
{
    return new GServer(app);
}