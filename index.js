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

function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

const artStr = `
 ██████╗ ██████╗ ███████╗     ██╗  ██╗███████╗██████╗ ███████╗███╗   ███╗ ██████╗ ███╗   ██╗██╗   ██╗
██╔════╝██╔════╝ ╚══███╔╝     ██║ ██╔╝██╔════╝██╔══██╗██╔════╝████╗ ████║██╔═══██╗████╗  ██║╚██╗ ██╔╝
██║     ██║  ███╗  ███╔╝█████╗█████╔╝ █████╗  ██████╔╝█████╗  ██╔████╔██║██║   ██║██╔██╗ ██║ ╚████╔╝ 
██║     ██║   ██║ ███╔╝ ╚════╝██╔═██╗ ██╔══╝  ██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║██║╚██╗██║  ╚██╔╝  
╚██████╗╚██████╔╝███████╗     ██║  ██╗███████╗██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║ ╚████║   ██║   
 ╚═════╝ ╚═════╝ ╚══════╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   
`;


program
    .version('0.1.0')
    .description(artStr)

program
    .command('start')
    .description('Start contributing to KZG Ceremony')
    .option('-s, --sequencer <sequencer URL>', 'URL to be used as a sequencer', 'https://seq.ceremony.ethereum.org')
    .action(async (options) => {

        const url = options.sequencer; 
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

        fs.writeFileSync('receipt.json', receiptJson, (err) => {
            if (err) throw err;
        }); 

        logger.info(`Successfully contributed!`);
        logger.info(receipt);
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
    const jsonDump = JSON.stringify(newContributions, null, '\t');
    try {
        fs.writeFileSync(`contributions.json`, jsonDump);
    } catch (error) {
        logger.error(`An error occurred while writing to the contributions.json: ${error.message}`);
    }

    logger.info('Send contributions');
    const receipt = await sequencer.contribute(sessionID, newContributions);
    return receipt;
}


program.parse(process.argv);
