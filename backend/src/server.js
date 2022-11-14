/* Importing the fs module. */
import { readFileSync } from "fs";
/* Importing the firebase-admin module. */
import admin from 'firebase-admin';
/* Importing the express module. */
import express from 'express';
/* Importing the MongoClient class from the mongodb module. */
import { connectToDb, db } from "./db.js";

/* Reading the credentials.json file and parsing it into a JavaScript object. */
const credentials = JSON.parse(
    readFileSync('../credentials.json', undefined, undefined, null)
);

/* Initializing the Firebase Admin SDK. */
admin.initializeApp({
    credential: admin.credential.cert(credentials),

});

/* Creating an instance of the Express application. */
const app = express();

/* Telling the server to parse the body of the request as JSON. */
app.use(express.json());

/* A middleware function that is called before any other route handler.
It checks if the request has an auth_token in the header.
If it does, it verifies the token and adds the user to the request object. */
app.use (async (req, res, next) => {
    const { auth_token } = req.header;
    if (auth_token) {
        try {
            req.user = await admin.auth().verifyIdToken(auth_token);
        }
        catch (e) {
            res.sendStatus(400);
        }
    }

    next();
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.get('/api/articles/:name', async(req, res) => {
   const { name } = req.params;
    const { uid } = req.user;

   const article = await db.collection('articles').findOne({ name });

   if (article) {
       const upvoteIds = article.upvoteIds || [];
       article.canUpvote = uid && !upvoteIds.include(uid);
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
        res.json(article)
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