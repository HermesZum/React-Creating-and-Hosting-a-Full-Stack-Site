/* Importing the express module. */
import express  from 'express';

/* Creating an instance of the Express application. */
const app = express();

/* Telling the server to parse the body of the request as JSON. */
app.use(express.json());

/* Creating a route that will respond to a GET request to the path /hello with the text "Hello!" */
app.post('/hello', (req, res) => {
    res.send(`Hello ${req.body.name}!`);
});

/* Telling the server to listen on port 8000. */
app.listen(8000, () => {
    console.log('Server is listening on port 8000!')
});