#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const contribute = require('./contribution/contribution.js');
const conversion = require('./contribution/coversion.js');
const seq = require('./sequencerclient/sequencerClient.js');
const bls = require('@noble/curves/bls12-381');
const Fr = bls.bls12_381.CURVE.Fr;

// const url = 'https://kzg-ceremony-sequencer-dev.fly.dev';
const url = 'http://34.64.236.141:3000';


function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

program
    .version('0.1.0')
    .description('A Test CLI')


program
    .command('auth')
    .action(async name => {
        const sequencer = new seq.Sequencer(url);
        const { status, eth, github } = await sequencer.requestLink();

        if(status !== 200) {
            // TODO: Handle error
            console.log("Somthings wrong...bye");
            return;
        }
        
        console.log('- Ethereum:', eth);
        console.log('- Github:', github);
    });

program
    .command('ceremony <sessionID>')
    .action(async sessionID => {
        console.log(`Starting ceremony ${sessionID}`);

        const sequencer = new seq.Sequencer(url);

        var resp;
        while(true) {
            resp = await sequencer.tryContribute(sessionID);

            if(resp.status !== 200) {
                const { status, msg } = resp;

                console.log(status, msg);
                await sleep(10);
                continue;
            }
            break;
        }

        console.log('Start ceremony...');

        console.log('Decoding...');
        contributions = conversion.decode(resp.contributions);
        //contributions = conversion.decode('{"contributions": [ '+resp.contributions+'}');

        rand = contribute.generateRandom();
        rand = Fr.create(rand);

        console.log('Update Power of Tau...');
        var newContributions = contribute.contribute(contributions, rand);

        console.log('Update Witnesses...');
        newContributions = contribute.updateWitness(newContributions, rand);

        rand = null;

        console.log('Encoding...');
        newContributions = conversion.encode(newContributions);

        const jsonDump = JSON.stringify(newContributions, null, '\t');
        fs.writeFile(`./${sessionID}.json`, jsonDump, (err) => {
            console.log('Write error', err);
        });

        const receipt = await sequencer.contribute(sessionID, newContributions);
        console.log(receipt);
    });

program.parse(process.argv);
