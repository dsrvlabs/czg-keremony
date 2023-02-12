const fs = require('fs');
const assert = require('assert');
const seq = require('../sequencerclient/sequencerClient.js');

const data = fs.readFileSync('./test/new_contribute.json');
const newContributions = JSON.parse(data);

describe('sequencer', function() {
    this.timeout(1000000);

    const url = 'https://kzg-ceremony-sequencer-dev.fly.dev';
    const sequencer = new seq.Sequencer(url);

    it('requestLink', async function() {
        const { status, eth, github } = await sequencer.requestLink();

        assert.equal(status, 200);

        console.log(eth);
        console.log(github);

        assert.notEqual(eth, '');
        assert.notEqual(github, '');
    });

    it('Fail tryContribute', async function() {
        const ret = await sequencer.tryContribute('');  // Empty session ID

        console.log(ret);
        assert.equal(ret.status, 400);
    });



    it('New Contributions', async function() {
        const sessionID = '';
        console.log(newContributions);

        const receipt = await sequencer.contribute(sessionID, newContributions);

        console.log(receipt);
    });

});
