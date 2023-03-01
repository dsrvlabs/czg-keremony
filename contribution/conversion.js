const bls = require('@noble/curves/bls12-381');
const { Worker } = require('worker_threads');

const util = bls.bls12_381.utils;
const G1 = bls.bls12_381.CURVE.G1;
const G2 = bls.bls12_381.CURVE.G2;
const G1Point = bls.bls12_381.G1.ProjectivePoint;
const G2Point = bls.bls12_381.G2.ProjectivePoint;

function decode(contributions){
    for (var i = 0; i < contributions.length; i++) {
        for(var j = 0; j < contributions[i].numG1Powers; j++){
            var hexStr = contributions[i].powersOfTau.G1Powers[j].substring(2);
            var hex = util.hexToBytes(hexStr);
            var affinePoint = G1.fromBytes(hex);
            contributions[i].powersOfTau.G1Powers[j] = affinePoint; 
        }

        for(var j = 0; j < contributions[i].numG2Powers; j++){
            var hexStr = contributions[i].powersOfTau.G2Powers[j].substring(2);
            var hex = util.hexToBytes(hexStr);
            var affinePoint = G2.fromBytes(hex);
            contributions[i].powersOfTau.G2Powers[j] = affinePoint;
        }
    }

    return contributions;
}

function encode(contributions){
    for (var i = 0; i < contributions.length; i++) {
        for(var j = 0; j < contributions[i].numG1Powers; j++){
            var affinePoint = contributions[i].powersOfTau.G1Powers[j];

            var prj = G1Point.fromAffine(affinePoint);
            var revert = G1.toBytes(G1Point, prj, true);
            contributions[i].powersOfTau.G1Powers[j] = "0x"+util.bytesToHex(revert);
        }

        for(var j = 0; j < contributions[i].numG2Powers; j++){
            var affinePoint = contributions[i].powersOfTau.G2Powers[j];
            var prj = G2Point.fromAffine(affinePoint);
            var revert = G2.toBytes(G2Point, prj, true);
            contributions[i].powersOfTau.G2Powers[j] = "0x"+util.bytesToHex(revert);
        }
    }

    return contributions;
}

async function decodeParallel(contributions) {
    const workers = [];
    contributions.forEach(c => {
        const worker = new Worker('./contribution/decode_worker.js', { workerData: { contribution: c } });
        workers.push(worker);
    });

    const decodeContributions = [];
    await Promise.all(workers.map((worker) => {
        return new Promise((resolve) => {
            worker.on('message', (message) => {
                decodeContributions.push(message);
                resolve();
            });
        });
    }));

    return decodeContributions;
}

module.exports = {
    decode: decode,
    encode: encode,
    decodeParallel: decodeParallel,
}
