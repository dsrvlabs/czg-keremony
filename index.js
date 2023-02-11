#!/usr/bin/env node

const program = require('commander');
const seq = require('./sequencerclient/sequencerClient.js');


const url = 'https://kzg-ceremony-sequencer-dev.fly.dev';


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

        console.log(resp.status);
        console.log(resp.contributions);

        // TODO: Get Random value.
        // TODO: update power of tau.
        // TODO: update witness.
    });


program.parse(process.argv);
