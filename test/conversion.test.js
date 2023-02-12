const fs = require('fs');
const assert = require("assert");
const bls = require('@noble/curves/bls12-381');


describe("Conversion", function(){
    this.timeout(1000000);

    const util = bls.bls12_381.utils;
    const data = fs.readFileSync('./test/try_contribute.json');
    const obj = JSON.parse(data);

    const G1 = bls.bls12_381.CURVE.G1;
    const G2 = bls.bls12_381.CURVE.G2;
    const G1Point = bls.bls12_381.G1.ProjectivePoint;
    const G2Point = bls.bls12_381.G2.ProjectivePoint;


    it("hex to affine to hex", () => {

        var prevG1power = obj.contributions[0].powersOfTau.G1Powers[0];
        var prevG2power = obj.contributions[0].powersOfTau.G2Powers[0];

        for (var i = 0; i < obj.contributions.length; i++) {
            for(var j = 0; j< obj.contributions[i].numG1Powers; j++){
            //for(var j = 0; j< 5; j++){
                var hexStr = obj.contributions[i].powersOfTau.G1Powers[j].substring(2);
                var hex = util.hexToBytes(hexStr);
                var affinePoint = G1.fromBytes(hex);
                obj.contributions[i].powersOfTau.G1Powers[j] = affinePoint; 
            }
            for(var k = 0; k< obj.contributions[i].numG2Powers; k++){
            // for(var k = 0; k< 5; k++){
                var hexStr = obj.contributions[i].powersOfTau.G2Powers[k].substring(2);
                var hex = util.hexToBytes(hexStr);
                var affinePoint = G2.fromBytes(hex);
                obj.contributions[i].powersOfTau.G2Powers[k] = affinePoint; 
            }
        }
    
        for (var i = 0; i < obj.contributions.length; i++) {
            for(var j = 0; j< obj.contributions[i].numG1Powers; j++){
            // for(var j = 0; j< 5; j++){
                var affinePoint = obj.contributions[i].powersOfTau.G1Powers[j];
                var prj = G1Point.fromAffine(affinePoint);
                var revert = G1.toBytes(G1Point, prj, true);
                obj.contributions[i].powersOfTau.G1Powers[j] = "0x"+util.bytesToHex(revert);
            }
            for(var k = 0; k< obj.contributions[i].numG2Powers; k++){
            //for(var k = 0; k< 5; k++){
                var affinePoint = obj.contributions[i].powersOfTau.G2Powers[k];
                var prj = G2Point.fromAffine(affinePoint);
                var revert = G2.toBytes(G2Point, prj, true);
                obj.contributions[i].powersOfTau.G2Powers[k] = "0x"+util.bytesToHex(revert);
            }
        }

        var curG1power = obj.contributions[0].powersOfTau.G1Powers[0];
        var curG2power = obj.contributions[0].powersOfTau.G2Powers[0];

        assert.equal(prevG1power, curG1power);
        assert.equal(prevG2power, curG2power);
    });
});