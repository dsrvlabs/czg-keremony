const bls = require('@noble/curves/bls12-381');


// Define inputs.
// TODO: Should convert serialized contributions to affine.
// TODO: Confirm by initialContribution.json
// TODO: Support multi-thread?
function contribute(contributions, rand) {
    console.log('updatePowerOfTau', rand);

    const G1Point = bls.bls12_381.G1.ProjectivePoint;
    const G2Point = bls.bls12_381.G2.ProjectivePoint;

    const G1 = bls.bls12_381.CURVE.G1;
    const G2 = bls.bls12_381.CURVE.G2;
    const Fr = bls.bls12_381.CURVE.Fr;

    const util = bls.bls12_381.utils;

    contributions.forEach(curContribution => {
        console.log('Contribution...');

        const g1Powers = curContribution.powersOfTau.G1Powers;
        const g2Powers = curContribution.powersOfTau.G2Powers;

        var xi = 1n;
        for(var i = 0; i < curContribution.numG1Powers; i++) {
        // for(var i = 0; i < 5; i++) {
            // TODO: Should be prepared from arguments.
            const g1Affine = G1.fromBytes(util.hexToBytes(g1Powers[i].substring(2)));
            const g1PrjPoint = G1Point.fromAffine(g1Affine);

            const g1NewPrjPoint = g1PrjPoint.multiply(xi);
            const g1NewAffine = G1.toBytes(G1Point, g1NewPrjPoint, true)

            if (i < curContribution.numG2Powers) {
                // TODO: Should be prepared from arguments.
                const g2Affine = G2.fromBytes(util.hexToBytes(g2Powers[i].substring(2)));
                const g2PrjPoint = G2Point.fromAffine(g2Affine);

                const g2NewPrjPoint = g2PrjPoint.multiply(xi);
                const g2NewAffine = G2.toBytes(G2Point, g2NewPrjPoint, true)
            }

            xi = (xi * rand) % Fr.ORDER;

            // console.log(i, g1Powers[i], util.bytesToHex(g1NewAffine), xi);
            // TODO: Store into object.
        }
    });

    return contributions
}

module.exports = {
    contribute: contribute,
};
