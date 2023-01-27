import { providers } from "ethers"
import { config } from "../config/constants"
import { transaction } from "../transactions"

class Processor {
    constructor() { }

    async processTxn(txnHash: string, wsProvider: providers.WebSocketProvider) {
        try {
            // On receiving a tx hash get the transaction data 
            const txnResponse = await transaction.getTxResponse(wsProvider, txnHash)

            if (txnResponse) {
                // Extract the transaction input data from the transaction data
                const txInput = txnResponse?.data

                if (txInput && !config.EXCLUDED_INPUT_DATA.includes(txInput)) {

                    // Decode transaction input data
                    const txnDescription = await transaction.decodeTxn(txInput)

                    // Get tokens being tracked


                    if (txnDescription) {
                        if (config.REMOVE_LIQUIDITY_METHODS.includes(txnDescription.name)) {
                            // Get the token removed liquidity from 
                            const tokens = transaction.getRemoveLiquidityToken(txnDescription)

                            if (trackedTokens.includes(tokens?.token!)) {
                                // A token we had bought previously is being remove liquidity
                                // Initiate exit strategy


                            }

                        }
                    }
                }
            }
        } catch (error) {
            console.log("Error processing transaction ", txnHash, error)
        }
    }
}

export const processor = new Processor()