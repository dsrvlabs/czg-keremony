const express = require('express');
const contribution = require('./contribution');

const app = express();
const port = 3000;

app.use('/contribution',contribution);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Sever started on port ${port}`);
});

module.exports = contribution;