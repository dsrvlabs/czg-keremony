const { workerData, parentPort } = require("worker_threads");
const _ = require('lodash');
const bls = require('@noble/curves/bls12-381');
const logger = require('../logger');


const G1Point = bls.bls12_381.G1.ProjectivePoint;
const G2Point = bls.bls12_381.G2.ProjectivePoint;
const Fr = bls.bls12_381.CURVE.Fr;


function contributeWorker() {
    var contribution = _.cloneDeep(workerData.contribution);
    const rand = workerData.rand;

    logger.info('Run contribute worker')

    const g1Powers = contribution.powersOfTau.G1Powers;
    const g2Powers = contribution.powersOfTau.G2Powers;
    var xi = BigInt(1);
    for(var i = 0; i < contribution.numG1Powers; i++) {
        const g1Affine = g1Powers[i];
        const g1PrjPoint = G1Point.fromAffine(g1Affine);

        const g1NewPrjPoint = g1PrjPoint.multiply(xi);
        const g1NewAffine = g1NewPrjPoint.toAffine();

        contribution.powersOfTau.G1Powers[i] = g1NewAffine;

        if (i < contribution.numG2Powers) {
            const g2Affine = g2Powers[i];
            const g2PrjPoint = G2Point.fromAffine(g2Affine);

            const g2NewPrjPoint = g2PrjPoint.multiply(xi);
            const g2NewAffine = g2NewPrjPoint.toAffine();

            contribution.powersOfTau.G2Powers[i] = g2NewAffine;
        }
        xi = (xi * rand) % Fr.ORDER;
    }

    parentPort.postMessage(contribution);
}

contributeWorker();
