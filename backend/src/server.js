/* Importing the express module. */
import express from 'express';
/* Importing the MongoClient class from the mongodb module. */
import { db, connectToDb } from "./db.js";

/* Creating an instance of the Express application. */
const app = express();

/* Telling the server to parse the body of the request as JSON. */
app.use(express.json());

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.get('/api/articles/:name', async(req, res) => {
   const { name } = req.params;

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

    await db.collection('articles').updateOne({ name }, {
        $inc: { upvote: 1 },
    });

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article)
    }
    else {
        res.send('That article doesn\'t exist!')
    }
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.post('/api/articles/:name/comment', async(req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

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

connectToDb(() => {
    /* Telling the server to listen on port 8000. */
    app.listen(8000, () => {
        console.log('Server is listening on port 8000!')
    });
}).then(r => console.log('Successfully connected to database.'));