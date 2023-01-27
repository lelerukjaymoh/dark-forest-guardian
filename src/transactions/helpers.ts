import { BigNumber, providers, utils } from "ethers"
import { addresses } from "../config/address"
import { config } from "../config/constants"
import { contract } from "../helpers/contract"
import { Tokens, TxnData } from "../helpers/types"
import { sendNotification } from "../telegram/bot"

class Transaction {
    constructor() {
    }

    async getTxResponse(provider: providers.WebSocketProvider, txnHash: string): Promise<providers.TransactionResponse | undefined> {
        try {
            return await provider.getTransaction(txnHash)
        } catch (error: any) {
            console.log("Error fetching the transaction ", txnHash, error)

            // Send a notification if getting the transaction response failed
            // await sendNotification(message.failedGetTxnMessage(txnHash, error))
        }
    }

    async decodeTxn(txInputData: string) {
        try {
            return await contract.tokenInterface.parseTransaction({ data: txInputData })
        } catch (error) {

            // This means that the ABI used does not support the method called in the transaction
            // Ignore all transaction that don't have supported methods 


            // console.log("Error decoding txn input data ", error)
        }
    }

    getRemoveLiquidityToken(txn: utils.TransactionDescription): Tokens | undefined {
        try {

            let token: any;
            let baseToken: any

            if (txn.name == "removeLiquidityETH" || txn.name == "removeLiquidityETHWithPermit") {
                token = txn.args.token
            } else if (txn.name == "removeLiquidity" || txn.name == "removeLiquidityWithPermit") {
                const liquidityPath: string[] = [txn.args.tokenA.toLowerCase(), txn.args.tokenB.toLowerCase()]

                const [_token, _baseToken] = this.getTxnToken(liquidityPath)

                token = _token.toLowerCase()
                baseToken = _baseToken.toLowerCase()

            }

            const tokens = {
                token,
                baseToken
            }

            return tokens

        } catch (error) {
            console.log("Error getting txn data ", error)
        }


    }

    getTxnToken(path: string[]): [string, string] {
        let token: string | undefined
        let baseToken: string | undefined

        if (config.BASE_TOKENS.includes(path[0])) {
            token = path[path.length - 1]
            baseToken = path[0]
        } else if (config.BASE_TOKENS.includes(path[path.length - 1])) {
            token = path[0]
            baseToken = path[path.length - 1]
        }

        return [token!, baseToken!]
    }
}

export const transaction = new Transaction()