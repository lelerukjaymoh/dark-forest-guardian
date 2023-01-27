import { providers } from "ethers"
import { dbOperations } from "../database"
import { providerSigner } from "../helpers/provider-signer"
import { processor } from "../processor"

class Streamer {
    wsProvider: providers.WebSocketProvider

    constructor() {
        this.wsProvider = providerSigner.wsProvider
    }

    listen

    stream() {

        // Fetch tracked tokens
        const trackedTokens = dbOperations.fetchTrackedTokens()

        // Listen for any token being inserted to the tracked token collection


        this.wsProvider.on("pending", async (txnHash: string) => {
            processor.processTxn(txnHash, this.wsProvider)
        })

        this.wsProvider.on("error", (tx) => {

            // TODO: Implement sending TG notification when there is a streaming error
            console.log("Error streaming transaction ", tx)
        })
    }
}

export const streamer = new Streamer()