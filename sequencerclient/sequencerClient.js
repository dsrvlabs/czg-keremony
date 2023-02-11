const axios = require('axios');


// const sequencerURL = "https://seq.ceremony.ethereum.org";
const sequencerURL = 'https://kzg-ceremony-sequencer-dev.fly.dev';  // For developments.

//Get ceremony status
async function getStatus(){
    await axios.get(sequencerURL+"/info/status")
        .then(response => {
            if (response.status === 200) {
                // res.data.lobby_size
                // res.data.num_contributions
                // res.data.sequencer_address
                return response.data;
            } else {
                console.error("getStatus Error, status code: " + response.status);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

//Request a current transcript
async function getCurrentTranscript(){
    await axios.get(sequencerURL+"/info/current_state")
        .then(response => {
            if (response.status === 200) {
                /* res.dats = {
                "transcripts": [
                    {
                    "powersOfTau": {
                        "G1Powers": [
                        "string"
                        ],
                        "G2Powers": [
                        "string"
                        ]
                    },
                    "witness": {
                        "runningProducts": [
                        "string"
                        ],
                        "potPubkeys": [
                        "string"
                        ]
                    }
                    }
                ]
                }
                */
                return response.data;
            } else {
                console.error("getCurrentTranscript Error, status code: " + response.status);
            }
        })
        .catch(error => {
            console.error(error);
        });
}


class Sequencer {
    constructor(url) {
        this.url = url;
    }

    getStatus(){
        axios.get(sequencerURL+"/info/status")
            .then(response => {
                if (response.status === 200) {
                    // res.data.lobby_size
                    // res.data.num_contributions
                    // res.data.sequencer_address
                    return response.data;
                } else {
                    console.error("getStatus Error, status code: " + response.status);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    //Request a current transcript
    getCurrentTranscript(){
        axios.get(sequencerURL+"/info/current_state")
            .then(response => {
                if (response.status === 200) {
                    /* res.dats = {
                "transcripts": [
                    {
                    "powersOfTau": {
                        "G1Powers": [
                        "string"
                        ],
                        "G2Powers": [
                        "string"
                        ]
                    },
                    "witness": {
                        "runningProducts": [
                        "string"
                        ],
                        "potPubkeys": [
                        "string"
                        ]
                    }
                    }
                ]
                }
                */
                    return response.data;
                } else {
                    console.error("getCurrentTranscript Error, status code: " + response.status);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    async requestLink() {
        // /auth/request_link
        const resp = await axios.get(sequencerURL+'/auth/request_link');

        var ret = {
            status: resp.status,
            eth: '',
            github: '',
        }

        if (resp.status == 200) {
            ret.eth = resp.data.eth_auth_url;
            ret.github= resp.data.github_auth_url;
        }

        return ret;
    }

    async tryContribute(sessionID) {
        try {
            const resp = await axios({
                method: 'post',
                url: `${this.url}/lobby/try_contribute`,
                headers: {
                    'Authorization': `Bearer ${sessionID}`,
                },
            });

            return {
                status: resp.status,
                contributions: resp.data.contributions,
            };
        } catch (err) {
            return {
                status: err.response.status,
                msg: err.response.data.error,
            }
        }
    }

}

module.exports = {
    Sequencer: Sequencer
};
