const fs = require('fs');
const contribute = require('./contribution/contribution.js');
const conversion = require('./contribution/conversion.js');


// const data = fs.readFileSync('./test/try_contribute_partial.json');
const data = fs.readFileSync('./test/try_contribute.json');
const obj = JSON.parse(data);

// TODO: How to create randoms?
console.log('Loading...');
contributions = conversion.decode(obj.contributions);

console.log('Loaded!!!', contributions);

const randValue = Math.floor(Math.random() * 100000);

console.log('Create new contribution...');

newContributions = contribute.contribute(contributions, BigInt(randValue));

console.log('New Contributions', newContributions);
console.log('Sample power', newContributions[0].powersOfTau.G1Powers[0]);

newContributions = contribute.updateWitness(newContributions, BigInt(randValue));

console.log('Convert back...');
newContributions = conversion.encode(newContributions);

// Store for compare.
jsonDump = JSON.stringify(newContributions, null, '\t');

fs.writeFile('./dump.json', jsonDump, (err) => {
    console.log('Write error', err);
});
