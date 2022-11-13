import { MongoClient } from "mongodb";

let db;

/* This is the URL of the MongoDB server. */
const url = "mongodb://127.0.0.1:27017";

/* Creating a constant variable called database and assigning it the value of "react-blog-db". */
const database = "react-blog-db";

async function connectToDb(cb) {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(database);
    cb();
}

export {
    db,
    connectToDb,
};

