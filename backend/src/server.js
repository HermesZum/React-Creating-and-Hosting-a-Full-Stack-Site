/* Importing the express module. */
import express from 'express';

let articlesInfo = [ {
    name: 'learn-react',
    upvote: 0,
    comments: [],
}, {
    name: 'learn-node',
    upvote: 0,
    comments: [],
}, {
    name: 'mongodb',
    upvote: 0,
    comments: [],
}, ]

/* Creating an instance of the Express application. */
const app = express();

/* Telling the server to parse the body of the request as JSON. */
app.use(express.json());

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params;
    const article = articlesInfo.find(a => a.name === name);
    if (article) {
        article.upvote += 1;
        res.send(`The ${ name } article now has ${ article.upvote } up-votes!!!`)
    }
    else {
        res.send('That article doesn\'t exist!')
    }
});

/* This is a route handler. It is a function that is called when a request is made to the server. */
app.post('/api/articles/:name/comment', (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    const article = articlesInfo.find(a => a.name === name);
    if (article) {
        article.comments.push({ postedBy, text });
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