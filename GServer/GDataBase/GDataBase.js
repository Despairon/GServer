const MONGODB_MODULE = 'mongodb';

const MongoDb = require(MONGODB_MODULE);

class GDataBase
{
    // <editor-fold desc="Interface members">

    constructor(dbName)
    {
        this.mongoClient = MongoDb.MongoClient;
        this.dbName      = dbName;
        this.db          = null;
    }

    connect(cb)
    {
        let url = `mongodb://localhost:27017/${this.dbName}`;

        this.mongoClient.connect(url, (err, db) =>
        {
            if (err == null)
            {
                console.log(`Connected successfully to database: ${this.dbName}`);
                this.db = db;
            }
            else
            {
                console.log(`Database ${this.dbName} connection error!`);
            }

            cb(err);
        });
    }

    disconnect()
    {
        if (this.db != null)
        {
            this.db.close();
            console.log(`Successfully disconnected from database: ${this.dbName}`);
        }
    }

    // </editor-fold>
}

module.exports = function(dbName)
{
    return new GDataBase(dbName);
};