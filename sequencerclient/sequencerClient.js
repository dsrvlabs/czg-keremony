const axios = require('axios');
const logger = require('../logger');

class Sequencer {
    constructor(url) {
        this.url = url;
    }

    async getStatus(){
        const resp = await axios.get(this.url+"/info/status");
        return {
            status: resp.status,
            lobby_size: resp.data.lobby_size,
        }
    }

    async requestLink() {
        // /auth/request_link
        const resp = await axios.get(this.url+'/auth/request_link');

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
                code: resp.data.code,
                error: resp.data.error,
            };
        } catch (err) {
            return {
                status: err.response.status,
                msg: err.response.data.error,
            }
        }
    }

    async contribute(sessionID, newContributions) {
        try {
            var msg = {
                "contributions": newContributions,
            };

            delete msg.contributions[0].blsSignature
            delete msg.contributions[1].blsSignature
            delete msg.contributions[2].blsSignature
            delete msg.contributions[3].blsSignature

            const resp = await axios({
                method: 'post',
                url: `${this.url}/contribute`,
                headers: {
                    "Authorization": `Bearer ${sessionID}`,
                    "Content-Type": "application/json;charset=utf-8",
                },
                data: msg,
            });

            if (resp.status !== 200) {
                return {
                    status: resp.status,
                }
            }
            return resp.data;
        } catch (err) {
            logger.error('contribute err', err);
            return {
                status: err.resposne.status,
                msg: err.response.data.error,
            }
        }
    }
}

module.exports = {
    Sequencer: Sequencer
};
