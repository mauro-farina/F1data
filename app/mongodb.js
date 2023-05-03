const {MongoClient} = require("mongodb");
require("dotenv").config({ path: './private/settings.env' });

//const connectionString = "mongodb+srv://maurofarina99:op3n-d4ta-mngmnT-c1oud-f1@f1app.kjpwvk7.mongodb.net/test";
//console.log(process.env.MONGODB_URI);
const client = new MongoClient(process.env.MONGODB_URI);

let _db;

module.exports = {
    getDB: () => _db,
    connect: async () => {
        await client.connect();
        _db = client.db("f1data");
    }
}