const fs = require('fs');
const assert = require("assert");

const _ = require('lodash');
const bls = require('@noble/curves/bls12-381');

const { decode, encode, decodeParallel } = require('../contribution/conversion.js');


describe("conversion", function(){

    const initialContributions = JSON.parse(fs.readFileSync('./contribution/initialContribution.json')).contributions;

    this.timeout(1000000);

    it('naive', function() {
        const contributions = _.cloneDeep(initialContributions);

        const t1 = performance.now();
        var ret = decode(contributions);

        const t2 = performance.now();
        console.log('Elapse Encode: %f seconds', (t2 - t1) / 1000);

        ret = encode(ret);
        const t3 = performance.now();
        console.log('Elapse Decode: %f seconds', (t3 - t2) / 1000);

        console.log('Elapse: Total %f seconds', (t3 - t1) / 1000);
    });

    it('worker', async function() {
        const contributions = _.cloneDeep(initialContributions);

        const workers = [];

        const t1 = performance.now();

        const decodeContributions = await decodeParallel(contributions);

        const t2 = performance.now();
        const elapse = t2 - t1;
        console.log('Decode Elapse: %f seconds', (t2 - t1) / 1000);

        const t3 = performance.now();
        const encodeContributions = encode(decodeContributions);

        console.log('Encode Elapse: %f seconds', (t3 - t2) / 1000);
        console.log('Total Elapse: %f seconds', (t3 - t1) / 1000);
    });

});
