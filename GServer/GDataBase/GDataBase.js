const MONGODB_MODULE = 'mongodb'

class GDataBase
{
    // <editor-fold desc="Interface members">

    constructor(dbName)
    {
        this.mongoClient = require(MONGODB_MODULE).MongoClient;
        this.dbName      = dbName;
        this.db          = null;
    }

    connect()
    {
        let url = `mongodb://localhost:27017/${this.dbName}`;

        this.mongoClient.connect(url, (err, db) =>
        {
            if (err == null)
            {
                console.log(`Connected successfully to database: ${this.dbName}`);
            }

            this.db = db;
        });
    }

    disconnect()
    {
        if (this.db != null)
        {
            this.db.close();
            console.log(`Disconnected successfully from database: ${this.dbName}`);
        }
    }

    // </editor-fold>
}

module.exports = function(dbName)
{
    return new GDataBase(dbName);
}