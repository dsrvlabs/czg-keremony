const bls = require('@noble/curves/bls12-381');

//const G1 = bls.bls12_381.CURVE.G1;
//const G2 = bls.bls12_381.CURVE.G2;
const G1Point = bls.bls12_381.G1.ProjectivePoint;
// const G2Point = bls.bls12_381.CURVE.G2.ProjectivePoint;

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
        console.log("A", a);
    });
});
