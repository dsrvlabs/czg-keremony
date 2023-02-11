const fs = require('fs');
const contribute = require('./contribute.js');


console.log('hello world');

const data = fs.readFileSync('./test/try_contribute.json');
const obj = JSON.parse(data);

// TODO: How to create randoms?
const randValue = Math.floor(Math.random() * 100000);

contribute.contribute(obj.contributions, BigInt(randValue));
