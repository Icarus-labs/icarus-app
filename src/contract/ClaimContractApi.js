import web3 from 'web3';
import Config from '../config'
import claimabi from './abi/claimabi.json';
import Wbe3Utils from './Wbe3Utils';
import * as Tools from '../utils/Tools';

import store from '../redux/store';

const {setting} = store.getState()

class ClaimContractApi {
    /**
     * 获取 Claim余额
     * @param {*}
     * @param {*}
     */
    async getCanClaim (address = '') {
        const network = setting.network
        try {
            const contract = new Wbe3Utils.eth.Contract(claimabi, Config[network].CLAIMROUTER);
            const canClaim = await contract.methods.can_claim().call({
                from: address,
            });
            return Tools.numDivDecimals(canClaim, Config[network].DDDECIMALS);
        } catch (err) {
            console.log(err);
            return 0;
        }
    }

    /**
     * Claim
     * @param {*}
     * @param {*}
     */
    async claim (
        address = '',
        ethereum,
        pendingFun = () => { },
        receiptFun = () => { },
        errorFun = () => { }
    ) {
        try {
            const network = setting.network
            const EthereumContract = new web3(ethereum);
            const contract = new EthereumContract.eth.Contract(
                claimabi,
                Config[network].CLAIMROUTER
            );

            return contract.methods
                .claim()
                .send({
                    from: address,
                })
                .on('transactionHash', function (transactionHash) {
                    // console.log('pending...', transactionHash);
                    pendingFun(transactionHash);
                    return transactionHash;
                })
                .on('receipt', (receipt) => {
                    // console.log('LptenTokenContract receipt', receipt);
                    receiptFun(receipt);
                    return receipt;
                })
                .on('error', function (error) {
                    // console.log('error', error);
                    errorFun();
                });
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default new ClaimContractApi();
