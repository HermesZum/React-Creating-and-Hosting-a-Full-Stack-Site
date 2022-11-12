/* Importing the express module. */
import express from 'express';

let articlesInfo = [ {
    name: 'learn-react',
    upvote: 0,
}, {
    name: 'learn-node',
    upvote: 0,
}, {
    name: 'mongodb',
    upvote: 0,
}, ]

/* Creating an instance of the Express application. */
const app = express();

/* Telling the server to parse the body of the request as JSON. */
app.use(express.json());

app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params;
    const article = articlesInfo.find(a => a.name === name);
    if (article) {
        article.upvote += 1;
        res.send(`The ${ name } article now has ${ article.upvote } up-votes.`)
    }
    else {
        res.send('That article doesn\'t exist!')
    }
});

/* Telling the server to listen on port 8000. */
app.listen(8000, () => {
    console.log('Server is listening on port 8000!')
});