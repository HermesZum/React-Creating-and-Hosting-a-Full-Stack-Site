/* Importing the express module. */
import express  from 'express';

/* Creating an instance of the Express application. */
const app = express();

/* Creating a route that will respond to a GET request to the path /hello with the text "Hello!" */
app.get('/hello', (req, res) => {
    res.send('Hello!');
});

/* Telling the server to listen on port 8000. */
app.listen(8000, () => {
    console.log('Server is listening on port 8000!')
});