const axios = require('axios');

const sequencerURL = "https://seq.ceremony.ethereum.org";

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