/*
 * @Description:
 * @Author:
 * @Date:
 * @LastEditTime:
 * @LastEditors:
 */

import { sendTransaction } from './EthereumRequest.js';
import { ApiAppAllowances } from '../services';

// 发送交易
export async function contractTransaction(
    account,
    contract,
    calldata,
    resFun,
    errFun
) {
    const txnParams = {
        from: account,
        to: contract,
        data: calldata,
    };
    sendTransaction(txnParams, resFun, errFun)
        .then((res) => {
            if (res) {
                // 成功的处理
                resFun();
            }
        })
        .catch((err) => {
            console.log('发生错误！', err);
            errFun();
            return false;
        });
}

//检测授权
export async function checkApprove(account, symbol, resFun) {
    try {
        ApiAppAllowances(account)
            .then((res) => {
                console.log(res);
                if (res) {
                    if (
                        symbol === 'USDT' &&
                        Number(res.data.usdt_dhm_pretty) > 0
                    ) {
                        console.log('USDT 授权成功');
                        resFun();
                    } else if (
                        symbol === 'DHM' &&
                        Number(res.data.dhm_stake_pretty) > 0
                    ) {
                        console.log('DHM 授权成功');
                        resFun();
                    } else {
                        setTimeout(() => {
                            checkApprove(account, symbol, resFun);
                        }, 5000);
                    }
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                return false;
            });
    } catch (err) {
        console.log(err);
        return false;
    }
}
