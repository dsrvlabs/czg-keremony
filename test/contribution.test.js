const fs = require('fs');
const assert = require("assert");

const conversion = require('../contribution/conversion.js');
const contribute = require('../contribution/contribution.js');
const bls = require('@noble/curves/bls12-381');

const Fr = bls.bls12_381.CURVE.Fr;


describe('contribution', function() {
    this.timeout(30 * 60 * 1000);

    it('naive', async function() {
        const data = fs.readFileSync('./test/try_contribute.json');
        const obj = JSON.parse(data);

        const t1 = performance.now();
        const decodeContributions = await conversion.decodeParallel(obj.contributions);
        const t2 = performance.now();

        console.log(`Covertion ${(t2 - t1) / 1000}`);

        var rand = [];
        for(var i =0; i < decodeContributions.length; i++) {
            rand[i] = contribute.generateRandom();
            rand[i] = Fr.create(rand[i]);
        }

        console.log('Update Power of Tau...');
        var newContributions = contribute.contribute(decodeContributions, rand);
        const t3 = performance.now();

        console.log(`Contribution ${(t3 - t2) / 1000}`);

        console.log('Update Witnesses...');
        newContributions = contribute.updateWitness(newContributions, rand);
        const t4 = performance.now();

        console.log(`Witness ${(t4 - t3) / 1000}`);
    });

    it('contribution.worker', async function() {
        console.log('start test with worker');

        const data = fs.readFileSync('./test/try_contribute.json');
        const obj = JSON.parse(data);

        const t1 = performance.now();
        const decodeContributions = await conversion.decodeParallel(obj.contributions);
        const t2 = performance.now();

        console.log(`Covertion ${(t2 - t1) / 1000}`);

        var rand = [];
        for(var i =0; i < decodeContributions.length; i++) {
            rand[i] = contribute.generateRandom();
            rand[i] = Fr.create(rand[i]);
        }

        console.log('Update Power of Tau...');
        var newContributions = await contribute.contributeParallel(decodeContributions, rand);
        const t3 = performance.now();

        console.log(`Contribution ${(t3 - t2) / 1000}`);

        console.log('Update Witnesses...');
        newContributions = contribute.updateWitness(newContributions, rand);
        const t4 = performance.now();

        console.log(`Witness ${(t4 - t3) / 1000}`);
    });

});
