const MONGODB_MODULE = 'mongodb';

const MongoDb = require(MONGODB_MODULE);

class GDataBase
{
    // <editor-fold desc="Interface members">


    constructor(dbName)
    {
        this.mongoClient = MongoDb.MongoClient;
        this.client      = undefined;
        this.dbName      = dbName;
        this.db          = undefined;

        this.collections =
        {
            IMAGES:       'Images',
            TEXT_CONTENT: 'TextContent'
        };

        this.documents =
        {
            HOMEPAGE_CONTENT:     'homepageContent',
            ABOUT_US_CONTENT:     'aboutUsContent',
            CONTACTS_CONTENT:     'contactsContent',
            OUR_SERVICES_CONTENT: 'ourServicesContent',
            OUR_PROCESS_CONTENT:  'ourProcessContent',
            IMAGE:                'img_'
        };
    };

    connect(dbPort, cb)
    {
        let url = `mongodb://localhost:${dbPort}`;

        this.mongoClient.connect(url, (err, client) =>
        {
            try
            {
                if (err == null)
                {
                    this.client = client;
                    this.db = this.client.db(this.dbName);

                    if ((this.client !== void(0)) && (this.db !== void(0)))
                    {
                        console.log(`Connected successfully to database: ${this.dbName}`);
                    }
                    else
                    {
                        let e = {stack: `Database ${this.dbName} connection error!`};

                        throw e;
                    }
                }
                else
                {
                    let e = {stack: `Database ${this.dbName} connection error!`};

                    throw e;
                }

            }
            catch (e)
            {
                err = true;

                console.log(e.stack);
            }

            cb(err);
        });
    }

    disconnect()
    {
        if ( (this.client != null) && (this.client !== void(0)) )
        {
            this.client.close();
            console.log(`Successfully disconnected from database: ${this.dbName}`);
        }
    }

    getValue(collection, document, callback)
    {
        try
        {
            this.db.collection(collection).find({name: document}).limit(1).toArray( (err, doc) =>
            {
                if ( (err == null) && (doc !== void(0)) )
                    callback(doc[0]);
                else
                {
                    let e = {stack: `Document ${document} from collection ${collection} retrieval error!`};

                    throw e;
                }
            });
        }
        catch (e)
        {
            console.log(e.stack);
            callback(undefined);
        }
    }

    // </editor-fold>
}

module.exports = function(dbName)
{
    return new GDataBase(dbName);
};