const fs = require('fs');
const assert = require("assert");
const bls = require('@noble/curves/bls12-381');
const contribute = require('../contribution/contribution.js');

const Fr = bls.bls12_381.CURVE.Fr;
const util = bls.bls12_381.utils;
const G1 = bls.bls12_381.CURVE.G1;
const G2 = bls.bls12_381.CURVE.G2;
const G1Point = bls.bls12_381.G1.ProjectivePoint;
const G2Point = bls.bls12_381.G2.ProjectivePoint;

const G1Aff = (x, y) => G1Point.fromAffine({ x, y });


// describe('bls', function() {
//         // Why do I have to call Fp.create?
//         console.log(G1Point);
// 
//         const Fp = bls.bls12_381.CURVE.Fp;
//         const n1 = Fp.create(
//             3971675556538908004130084773503021351583407620890695272226385332452194486153316625183061567093226342405194446632851n
//         );
//         const n2 = Fp.create(
//             1120750640227410374130508113691552487207139112596221955734902008063040284119210871734388578113045163251615428544022n
//         );
// 
//         const a = G1Aff(n1, n2);
//         a.assertValidity();
// 
//         console.log("A", a);
//     });
// 
//     it('mul', function() {
//         console.log('==');
//     });
// });

describe('power-of_tau', function() {

    it('Load contributes', function() {
        const data = fs.readFileSync('./test/try_contribute.json');
        const obj = JSON.parse(data);
        // console.log(obj.contributions);

        obj.contributions.forEach((c, i) => {
            console.log(i, c.numG1Powers, c.numG2Powers);
        });
    });

    it('affine transform', function() {
        const data = fs.readFileSync('./test/try_contribute.json');
        const obj = JSON.parse(data);
        // console.log(obj.contributions);

        // TODO: Affine transform.
        const util = bls.bls12_381.utils;
        const g1Power = "0xaeb984397ba2ff6caac1792ee60910451fb515e02b331398d4d9f6105802fb733361e5b42ce45d4d89ff7af37fe37375";

        const hexStr = g1Power.substring(2);
        console.log('Hex Str', hexStr);

        const hex = util.hexToBytes(hexStr);
        console.log('Hex Data', hex);

        // No affine transform function.
        const G1 = bls.bls12_381.CURVE.G1;
        // const G2 = bls.bls12_381.CURVE.G2;
        // const Fp12 = bls.bls12_381.CURVE.Fp12;

        const affinePoint = G1.fromBytes(hex);
        console.log('Affine', affinePoint);

        const prj = G1Point.fromAffine(affinePoint);
        console.log('Projection', prj);
        const revert = G1.toBytes(G1Point, prj, true);

        // TODO: Revert. 
        console.log('Affine to hex', revert);
        console.log('Affine to hex str1', util.bytesToHex(revert));

        // ----
        // ----
        const prjPointG1 = G1Point.fromAffine(affinePoint);
        prjPointG1.assertValidity();

        console.log('base1', G1Point.BASE);
        console.log('proj1', prjPointG1);

        const prjPointG1Mul = prjPointG1.multiply(2n);
        console.log('proj1 multi', prjPointG1Mul);

        // TODO: Convert to hex
        console.log('proj1 multi', prjPointG1Mul);

        const mulAffine = prjPointG1Mul.toAffine();
        console.log('proj1 to Affine', prjPointG1Mul.toAffine());

        console.log('proj1 to Hex', G1.toBytes(G1Point, prjPointG1Mul, true));
        console.log('proj1 to HexStr', util.bytesToHex(G1.toBytes(G1Point, prjPointG1Mul, true)));

        // ----

        // TODO: Just BigInt multi / mod operation.
        // const xi = 1n;
        // const frModulus = 52435875175126190479447740508185965837690552500527637822603658699938581184513n;
        // console.log('G1', G1);
        // console.log('G2', G2);
        // console.log('Fp12', Fp12);
    });

    // TODO: Transform all contributes to affine space.
    it('fr', function() {
        const G1 = bls.bls12_381.CURVE.G1;
        const Fr = bls.bls12_381.CURVE.Fr;

        console.log('Find fr', Fr);
    });

    it('witness', function() {
        const potPubkey = '0x93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8';
        const hexStr = potPubkey.substring(2);

        // PotPub -> G2Affine
        const util = bls.bls12_381.utils;
        const hex = util.hexToBytes(hexStr);

        const G2 = bls.bls12_381.CURVE.G2;
        const G2Point = bls.bls12_381.G2.ProjectivePoint;

        const potPubkeyAffine = G2.fromBytes(hex);
        console.log(potPubkeyAffine);

        const potPubkeyPrj = G2Point.fromAffine(potPubkeyAffine);

        const newPubkeyPrj = potPubkeyPrj.multiply(2n)

        console.log('New pub', newPubkeyPrj);
        console.log('ret', util.bytesToHex(G2.toBytes(G2Point, newPubkeyPrj, true)));
    });
});

// Spec from https://github.com/ethereum/kzg-ceremony-specs/blob/master/docs/participant/participant.md
// def update_powers_of_tau(contribution: Contribution, x: int) -> Contribution:
//     '''
//     Updates the Powers of Tau within a sub-ceremony by multiplying each with a successive power of the secret x.
//     '''
//     x_i = 1
//     for i in range(contribution.num_g1_powers):
//         # Update G1 Powers
//         contribution.powers_of_tau.g1_powers[i] = bls.G1.mul(x_1, contribution.powers_of_tau.g1_powers[i])
//         # Update G2 Powers
//         if i < contribution.num_g2_powers:
//             contribution.powers_of_tau.g2_powers[i] = bls.G2.mul(x_1, contribution.powers_of_tau.g2_powers[i])
//         x_i = (x_i * x) % bls.r
//     return contribution

// def update_witness(contribution: Contribution, x: int) -> Contribution:
//     contribution.pot_pubkey = bls.G2.mul(x, bls.G2.g2)
//     return contribution

describe('Random', function() {
    it('Generate Random', function(){
        var random = contribute.generateRandom();
        console.log("rand: "+random);
        random  = Fr.create(random);
        console.log("Fr.create(rand): "+random);
    });
});