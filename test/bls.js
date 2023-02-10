const fs = require('fs');

const bls = require('@noble/curves/bls12-381');

const G1Point = bls.bls12_381.G1.ProjectivePoint;
const G2Point = bls.bls12_381.G2.ProjectivePoint;

const G1Aff = (x, y) => G1Point.fromAffine({ x, y });

describe('bls', function() {
    it('Fp', function() {
        // Why do I have to call Fp.create?
        console.log(G1Point);

        const Fp = bls.bls12_381.CURVE.Fp;
        const n1 = Fp.create(
            3971675556538908004130084773503021351583407620890695272226385332452194486153316625183061567093226342405194446632851n
        );
        const n2 = Fp.create(
            1120750640227410374130508113691552487207139112596221955734902008063040284119210871734388578113045163251615428544022n
        );

        const a = G1Aff(n1, n2);
        a.assertValidity();

        console.log("A", a);
    });

    it('mul', function() {
        console.log('==');
    });
});

describe('power-of_tau', function() {
    it('affine transform', function() {
        const data = fs.readFileSync('./test/try_contribute.json');
        const obj = JSON.parse(data);
        console.log(obj);

        // TODO: Affine transform.
        const util = bls.bls12_381.utils;
        const g1Power = "0xaeb984397ba2ff6caac1792ee60910451fb515e02b331398d4d9f6105802fb733361e5b42ce45d4d89ff7af37fe37375";

        const hex = util.hexToBytes(g1Power.substring(2));
        console.log(hex);

        // No affine transform function.
        console.log(bls.bls12_381.CURVE.G1.fromBytes(hex));

        // TODO: Create new curve. (Necessary?)
    });

    // TODO: Transform all contributes to affine space.
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