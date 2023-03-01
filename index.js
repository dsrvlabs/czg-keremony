#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');

const contribute = require('./contribution/contribution.js');
const conversion = require('./contribution/conversion.js');
const seq = require('./sequencerclient/sequencerClient.js');
const logger = require('./logger');
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
            logger.error("Somthings wrong...bye");
            return;
        }
        
        console.log('- Ethereum:', eth);
        console.log('- Github:', github);
    });

program
    .command('ceremony <sessionID>')
    .option('-e, --entropy <entropy word>')
    .action(async (sessionID, options) => {
        const RETRY_SEC = 30;

        logger.info('Starting ceremony...');

        const sequencer = new seq.Sequencer(url);

        var resp;
        while(true) {
            resp = await sequencer.tryContribute(sessionID);
            if(resp.status == 200) {
                if(resp.error != null) {
                    logger.info(`${resp.error} - retry after ${RETRY_SEC} seconds`);
                    await sleep(RETRY_SEC);
                    continue
                }
                break;
            }

            if(resp.status === 400) {
                logger.error(resp.msg);
                logger.info(`Retry after ${RETRY_SEC} seconds`);
                await sleep(RETRY_SEC);
                continue;
            } else {
                logger.error(`Error ${resp.status}`);
                return;
            }
            break;
        }

        logger.info('Decoding...');
        const decodeContributions = await conversion.decodeParallel(resp.contributions);
        
        var rands = [];
        var entropy = "";
        if(options.entropy){
            entropy = options.entropy;
        }
        for(var i = 0; i < resp.contributions.length; i++) {
            rands[i] = contribute.generateRandom(entropy);
            rands[i] = Fr.create(rands[i]);
        }

        logger.info('Update Power of Tau...');
        var newContributions = await contribute.contributeParallel(decodeContributions, rands);

        logger.info('Update Witnesses...');
        newContributions = contribute.updateWitness(newContributions, rands);

        rands = null;

        logger.info('Encoding...');
        newContributions = conversion.encode(newContributions);

        const jsonDump = JSON.stringify(newContributions, null, '\t');
        fs.writeFile(`./${sessionID}.json`, jsonDump, (err) => {});

        logger.info('Send contributions');
        const receipt = await sequencer.contribute(sessionID, newContributions);
        const receiptJson = JSON.stringify(receipt, null, '\t');

        logger.info(receipt);
        fs.writeFileSync('receipt.json', receiptJson, (err) => {
            if (err) throw err;
        });
    });

program
    .command('start')
    .action(async () => {
        const entropy = generateEntropy();

        const sequencer = new seq.Sequencer(url);
        const { provider, authUrl } = await authentication(sequencer);

        console.log(authUrl);
        console.log('');
        console.log('');

        const { sessionID } = await inquirer.prompt({
            type: 'input',
            name: 'sessionID',
            message: 'Input your session ID: ',
        });

        const prevContributions = await tryAndWait(sequencer, sessionID);
        const receipt = await runCeremony(sequencer, sessionID, entropy, prevContributions);
        const receiptJson = JSON.stringify(receipt, null, '\t');

        logger.info(receipt);
        fs.writeFileSync('receipt.json', receiptJson, (err) => {
            if (err) throw err;
        });
    });

async function generateEntropy() {
    // TODO: Entropy
    // Some ideas.
    // Read standard mnemonic words and make users to choose some words.
    // Words that will provided on questions should be choosen randomly.
    // This function will gather answers and create entropy.
    return 'hello-world';
}

async function authentication(sequencer) {
    console.log('Authentication');

    const questions = [
        {
            type: 'list',
            name: 'authProvider',
            message: 'Which method do you prefer for authentication?',
            choices: ['ethereum', 'github'],
        },
    ];

    const { authProvider } = await inquirer.prompt(questions);
    const { status, eth, github } = await sequencer.requestLink();

    // TODO: Add kind instructions how to get a session id.

    if(authProvider === 'github') {
        return {
            provider: authProvider,
            authUrl: github,
        }
    } else if(authProvider === 'ethereum') {
        return {
            provider: authProvider,
            authUrl: eth,
        }
    } else {
        return null;
    }
}

async function tryAndWait(sequencer, sessionID) {
    logger.info('Try and Wait...');

    const RETRY_SEC = 30;

    // TODO: Show wait progress.
    var resp;
    while(true) {
        resp = await sequencer.tryContribute(sessionID);
        if(resp.status == 200) {
            if(resp.error != null) {
                logger.info(`${resp.error} - retry after ${RETRY_SEC} seconds`);
                await sleep(RETRY_SEC);
                continue
            }

            return resp.contributions;
        }

        if(resp.status === 400) {
            logger.error(resp.msg);
            logger.info(`Retry after ${RETRY_SEC} seconds`);
            await sleep(RETRY_SEC);
            continue;
        } else {
            logger.error(`Error ${resp.status}`);
            return;
        }
        break;
    }
}

async function runCeremony(sequencer, sessionID, entropy, prevContributions) {
    logger.info('Run Ceremony...');

    logger.info('Decoding contributions....');
    const decodeContributions = await conversion.decodeParallel(prevContributions);
    
    var rands = [];
    for(var i = 0; i < prevContributions.length; i++) {
        rands[i] = contribute.generateRandom(entropy);
        rands[i] = Fr.create(rands[i]);
    }

    logger.info('Update Power of Tau...');
    var newContributions = await contribute.contributeParallel(decodeContributions, rands);

    logger.info('Update Witnesses...');
    newContributions = contribute.updateWitness(newContributions, rands);

    rands = null;

    logger.info('Encoding...');
    newContributions = conversion.encode(newContributions);

    logger.info('Send contributions');
    const receipt = await sequencer.contribute(sessionID, newContributions);
    return receipt;
}


program.parse(process.argv);
