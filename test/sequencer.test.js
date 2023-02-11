const assert = require('assert');
const seq = require('../sequencerclient/sequencerClient.js');


describe('sequencer', function() {

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

});
