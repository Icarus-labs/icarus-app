// import { web3 } from '~/components/web3'
import { subscribe } from '@nextcloud/event-bus'
import { watchTransaction } from 'components/utils'
import config from 'config'
import store from '../redux/store';

const {setting} = store.getState()


async function sendTransaction(transactionParameters, desc) {
    // approvedActionParam will be called when approvement is approved

    const network = setting.network
    return new Promise(async (resolve, reject) => {
        console.log(transactionParameters[0], 'aaaavbbb')
        await window.ethereum
            .request({
                method: "eth_sendTransaction",
                params: [{ ...transactionParameters[0], chainId: config[network].chainId }],
            })
            .then(async (txHash) => {
                let previousActionObj = JSON.parse(localStorage.getItem('actionObj')) || {}
                previousActionObj[txHash] = {
                    desc: transactionParameters[0].isApprove ? `Approve ${desc}` : desc,
                    action: transactionParameters[1] ? [transactionParameters[1]] : ''
                }
                localStorage.setItem('actionObj', JSON.stringify(previousActionObj))

                subscribe(txHash, (val) => {
                    resolve(val)
                })

                watchTransaction(txHash)
            })
            .catch((error) => {
                resolve(false)
                // me.$message.error(me.$t("hint.rejected"));
            })
    })

    // 这里就不需要检查地址了
    // notification.error({
    //     message: 'Failed',
    //     description: 'Address not detected',
    //     icon: h => {
    //         return h('a-icon', { props: { type: 'close', style: { 'color': 'red' } } })
    //     }
    // })
}



export default {
    sendTransaction
}

