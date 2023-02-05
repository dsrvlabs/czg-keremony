const BigNumber = require('bn.js');
const elliptic = require('elliptic');
const bls12381 = new elliptic.ec('bls12-381');

const g2Generator = bls12381.g.mul(bls12381.g.tau());

class PowersOfTau {
    constructor() {
        this.G1Affines = [];
        this.G2Affines = [];
    }
}

class Contribution {
    constructor() {
        this.NumG1Powers = 0;
        this.NumG2Powers = 0;
        this.PowersOfTau = new PowersOfTau();
        this.PotPubKey = g2Generator;
    }

    async verify(previousContribution){
        //TBD
        return true;
    }

    updatePowersOfTau(x){
        let xi 
        //TBD
    }

    updateWithness(x){
        //TBD
    }

}
