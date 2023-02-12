const bls = require('@noble/curves/bls12-381');


// Define inputs.
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

    for(var i = 0; i < contributions.length; i++) {
        const g1Powers = contributions[i].powersOfTau.G1Powers;
        const g2Powers = contributions[i].powersOfTau.G2Powers;

        var xi = 1n;
        for(var j = 0; j < contributions[i].numG1Powers; j++) {
            const g1Affine = g1Powers[j];
            const g1PrjPoint = G1Point.fromAffine(g1Affine);

            const g1NewPrjPoint = g1PrjPoint.multiply(xi);
            // const g1NewAffine = G1.toBytes(G1Point, g1NewPrjPoint, true)
            const g1NewAffine = g1NewPrjPoint.toAffine();

            //console.log(j, g1Powers[j], util.bytesToHex(g1NewAffine), xi);
            contributions[i].powersOfTau.G1Powers[j] = g1NewAffine;

            if (j < contributions[i].numG2Powers) {
                const g2Affine = g2Powers[j];
                const g2PrjPoint = G2Point.fromAffine(g2Affine);

                const g2NewPrjPoint = g2PrjPoint.multiply(xi);
                // const g2NewAffine = G2.toBytes(G2Point, g2NewPrjPoint, true)
                const g2NewAffine = g2NewPrjPoint.toAffine();

                //console.log(i, g1Powers[j], util.bytesToHex(g2NewAffine), xi);
                contributions[i].powersOfTau.G2Powers[j] = g2NewAffine;
            }

            xi = (xi * rand) % Fr.ORDER;

            //console.log('==============================================');

            // TODO: Store into object.
        }
    };

    return contributions
}

module.exports = {
    contribute: contribute,
};
