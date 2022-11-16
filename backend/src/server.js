/* Importing the fs module. */
import fs from 'fs';
/* Importing the path module. */
import path from "path";
/* Importing the firebase-admin module. */
import admin from 'firebase-admin';
/* Importing the express module. */
import express from 'express';
/* Importing the MongoClient class from the mongodb module. */
import { connectToDb, db } from "./db.js";
/* Importing the fileURLToPath function from the url module. */
import { fileURLToPath } from 'url';

/* Getting the path of the current file. */
const __filename = fileURLToPath(import.meta.url);
/* Getting the path of the current file. */
const __dirname = path.dirname(__filename);
/* Reading the credentials.json file and parsing it into a JavaScript object. */
const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);
/* Initializing the Firebase Admin SDK. */
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});
/* Creating an instance of the Express application. */
const app = express();
/* Telling the server to parse the body of the request as JSON. */
app.use(express.json());
/* Telling the server to serve the static files in the build folder. */
app.use(express.static(path.join(__dirname, '../build')));
/* This is a route handler. It is a function that is called when a request is made to the server. */
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

/* A middleware function that is called before any other route handler.
It checks if the request has an auth_token in the header.
If it does, it verifies the token and adds the user to the request object. */
app.use(async (req, res, next) => {
    const { auth_token } = req.headers;
    if (auth_token) {
        try {
            req.user = await admin.auth().verifyIdToken(auth_token);
        }
        catch (e) {
            return res.sendStatus(400);
        }
    }
    req.user = req.user || {};
    next();
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.get('/api/articles/:name', async(req, res) => {
   const { name } = req.params;
   const { uid } = req.user;

   const article = await db.collection('articles').findOne({ name });

   if (article) {
       const upvoteIds = article.upvoteIds || [];
       article.canUpvote = uid && !upvoteIds.includes(uid);
       res.json(article);
   }
   else {
        res.sendStatus(404);
   }
});

/* This is a middleware function that is called before any other route handler.
It checks if the request has an auth_token in the header.
If it does, it verifies the token and adds the user to the request object. */
app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.put('/api/articles/:name/upvote', async(req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);

        if (canUpvote) {
            await db.collection('articles').updateOne({ name }, {
                $inc: { upvote: 1 },
                $push: { upvoteIds: uid }
            });
        }

        const updatedArticle = await db.collection('articles').findOne({ name });
        res.json(updatedArticle)
    }
    else {
        res.send('That article doesn\'t exist!')
    }
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.post('/api/articles/:name/comment', async(req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const { email } = req.user;

    /**
     * It takes a user object and returns the first part of the user's email address
     * @returns The substring of the email address up to the @ symbol.
     */
    let trimEmail = () => {
        const i = email.indexOf('@');
        return email.substring(0, i);
    }

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy: trimEmail(), text  } },
    });
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article)
    }
    else {
        res.send('That article doesn\'t exist!')
    }
});

/* Setting the port to the value of the PORT environment variable,
or 8000 if the PORT environment variable is not set. */
const PORT = process.env.PORT || 8000;

/* Telling the server to listen on port 8000. */
connectToDb(() => {
    /* Telling the server to listen on port 8000. */
    app.listen(PORT, () => {
        console.log('Server is listening on port ' + PORT)
    });
}).then(r => console.log('Successfully connected to database.'));