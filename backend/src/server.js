/* Importing the express module. */
import express from 'express';
/* Importing the MongoClient class from the mongodb module. */
import { MongoClient } from "mongodb";

/* Creating an instance of the Express application. */
const app = express();

/* This is the URL of the MongoDB server. */
const url = "mongodb://127.0.0.1:27017";

/* Creating a constant variable called database and assigning it the value of "react-blog-db". */
const database = "react-blog-db";

/* Telling the server to parse the body of the request as JSON. */
app.use(express.json());

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.get('/api/articles/:name', async(req, res) => {
   const { name } = req.params;

   const client = new MongoClient(url);
   await client.connect();
   const db = client.db(database);

   const article = await db.collection('articles').findOne({ name });

   if (article) {
       res.json(article);
   }
   else {
        res.sendStatus(404);
   }
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.put('/api/articles/:name/upvote', async(req, res) => {
    const { name } = req.params;

    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(database);

    await db.collection('articles').updateOne({ name }, {
        $inc: { upvote: 1 },
    });

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.send(`The ${ name } article now has ${ article.upvote } up-votes!!!`)
    }
    else {
        res.send('That article doesn\'t exist!')
    }
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.post('/api/articles/:name/comment', async(req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(database);

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text  } },
    });

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.send(article.comments)
    }
    else {
        res.send('That article doesn\'t exist!')
    }
});

/* Telling the server to listen on port 8000. */
app.listen(8000, () => {
    console.log('Server is listening on port 8000!')
});