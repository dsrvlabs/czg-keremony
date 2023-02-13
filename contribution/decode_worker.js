const { workerData, parentPort } = require("worker_threads");
const _ = require('lodash');
const bls = require('@noble/curves/bls12-381');


const util = bls.bls12_381.utils;
const G1 = bls.bls12_381.CURVE.G1;
const G2 = bls.bls12_381.CURVE.G2;
const G1Point = bls.bls12_381.G1.ProjectivePoint;
const G2Point = bls.bls12_381.G2.ProjectivePoint;


function decodeWorker() {
    var decodeContribution = _.cloneDeep(workerData.contribution);
    for(var i = 0; i < decodeContribution.numG1Powers; i++){
        var hexStr = decodeContribution.powersOfTau.G1Powers[i].substring(2);
        var hex = util.hexToBytes(hexStr);
        var affinePoint = G1.fromBytes(hex);
        decodeContribution.powersOfTau.G1Powers[i] = affinePoint; 
    }

    for(var i = 0; i < decodeContribution.numG2Powers; i++){
        var hexStr = decodeContribution.powersOfTau.G2Powers[i].substring(2);
        var hex = util.hexToBytes(hexStr);
        var affinePoint = G2.fromBytes(hex);
        decodeContribution.powersOfTau.G2Powers[i] = affinePoint; 
    }

    parentPort.postMessage(decodeContribution);
}

decodeWorker();
