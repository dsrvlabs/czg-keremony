#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const contribute = require('./contribution/contribution.js');
const conversion = require('./contribution/coversion.js');
const seq = require('./sequencerclient/sequencerClient.js');
const bls = require('@noble/curves/bls12-381');
const Fr = bls.bls12_381.CURVE.Fr;

// const url = 'https://seq.ceremony.ethereum.org';
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
        const RETRY_SEC = 30;

        console.log('Starting ceremony...');

        const sequencer = new seq.Sequencer(url);

        var resp;
        while(true) {
            resp = await sequencer.tryContribute(sessionID);
            if(resp.status == 200) {
                if(resp.error != null) {
                    console.log(`${resp.error} - retry after ${RETRY_SEC} seconds`);
                    await sleep(RETRY_SEC);
                    continue
                }
                break;
            }

            if(resp.status === 400) {
                console.log(resp.msg);
                console.log(`Retry after ${RETRY_SEC} seconds`);
                await sleep(RETRY_SEC);
                continue;
            } else {
                console.log(`Error ${resp.status}`);
                return;
            }
            break;
        }

        console.log('Decoding...');
        const decodeContributions = await conversion.decodeParallel(resp.contributions);
        
        var rands = [];
        for(var i = 0; i < resp.contributions.length; i++) {
            rands[i] = contribute.generateRandom();
            rands[i] = Fr.create(rands[i]);
        }

        console.log('Update Power of Tau...');
        var newContributions = await contribute.contributeParallel(decodeContributions, rands);

        console.log('Update Witnesses...');
        newContributions = contribute.updateWitness(newContributions, rands);

        rands = null;

        console.log('Encoding...');
        newContributions = conversion.encode(newContributions);

        const jsonDump = JSON.stringify(newContributions, null, '\t');
        fs.writeFile(`./${sessionID}.json`, jsonDump, (err) => {});

        console.log('Send contributions');
        const receipt = await sequencer.contribute(sessionID, newContributions);
        console.log(receipt);
    });

program.parse(process.argv);
