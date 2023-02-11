const bls = require('@noble/curves/bls12-381');

const util = bls.bls12_381.utils;
const G1 = bls.bls12_381.CURVE.G1;
const G2 = bls.bls12_381.CURVE.G2;
const G1Point = bls.bls12_381.G1.ProjectivePoint;
const G2Point = bls.bls12_381.G2.ProjectivePoint;

function decode(contributions){
    for (var i = 0; i < contributions.length; i++) {
        for(var j = 0; j< contributions[i].numG1Powers; j++){
            var hexStr = contributions[i].powersOfTau.G1Powers[j].substring(2);
            var hex = util.hexToBytes(hexStr);
            var affinePoint = G1.fromBytes(hex);
            contributions[i].powersOfTau.G1Powers[j] = affinePoint; 
        }
        for(var k = 0; k< contributions[i].numG2Powers; k++){
            var hexStr = contributions[i].powersOfTau.G2Powers[k].substring(2);
            var hex = util.hexToBytes(hexStr);
            var affinePoint = G2.fromBytes(hex);
            contributions[i].powersOfTau.G2Powers[k] = affinePoint; 
        }
    }
    return contributions;
}

function encode(contributions){
    for (var i = 0; i < contributions.length; i++) {
        for(var j = 0; j< contributions[i].numG1Powers; j++){
            var affinePoint = contributions[i].powersOfTau.G1Powers[j];
            var prj = G1Point.fromAffine(affinePoint);
            var revert = G1.toBytes(G1Point, prj, true);
            contributions[i].powersOfTau.G1Powers[j] = "0x"+util.bytesToHex(revert);
        }
        for(var k = 0; k< contributions[i].numG2Powers; k++){
            var affinePoint = contributions[i].powersOfTau.G2Powers[k];
            var prj = G2Point.fromAffine(affinePoint);
            var revert = G2.toBytes(G2Point, prj, true);
            contributions[i].powersOfTau.G2Powers[k] = "0x"+util.bytesToHex(revert);
        }
    }
    return contributions;
}
