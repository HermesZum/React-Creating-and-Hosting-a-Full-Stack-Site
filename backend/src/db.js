import { MongoClient } from "mongodb";

let db;

/* Creating a constant variable called database and assigning it the value of "react-blog-db". */
const database = "react-blog-db";

async function connectToDb(cb) {
    const client = new MongoClient(
        `mongodb+srv://${ process.env.MONGO_USERNAME }:${ process.env.MONGO_PASSWORD }@cluster01.m6oald2.mongodb.net/?retryWrites=true&w=majority`
    );
    await client.connect();
    db = client.db(database);
    cb();
}

export {
    db,
    connectToDb,
};

