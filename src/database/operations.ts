import { addresses } from "../config/address";
import { config } from "../config/constants";
import { contract } from "../helpers/contract";
import { BoughtTokens, TokenInterface } from "../helpers/types";
import { TrackedTokens } from "./models"

class DBOperations {
    trackedTokens: BoughtTokens = {}
    changeStream

    constructor() {
        this.changeStream = TrackedTokens.watch();
    }

    async fetchTrackedTokens() {
        try {
            const _trackedTokens: TokenInterface[] = await TrackedTokens.find()
            console.log("Tracked Tokens ", _trackedTokens)

            _trackedTokens.map((token) => { this.trackedTokens[token.tokenAddress!] = token })

        } catch (error) {
            console.log("Error fetching tracked tokens : ", error)
        }
    }

    async listenTrackedTokens() {
        try {

            this.changeStream.on("change", async (change: any) => {
                try {

                    if (change.operationType == "update") {
                        const tokenData = await TrackedTokens.findById(change.documentKey._id);
                        const tokenAddress = tokenData!.tokenAddress
                        const bought = tokenData!.bought
                        const sold = tokenData!.sold
                        const txHash = tokenData!.txHash

                        if (tokenData && bought && sold) {
                            if (!Object.keys(this.trackedTokens).includes(tokenAddress)) {

                                // Check that we still hold the token before adding it to the list of tokens to save from scam
                                // const tokenBalance = await contract.getTokenBalance(tokenAddress, addresses.SWAPPER_ADDRESS)

                                this.trackedTokens[tokenAddress] = { tokenAddress, bought, sold, txHash }
                            }
                        } else if (tokenData && tokenData.sold) {
                            if (Object.keys(this.trackedTokens).includes(tokenAddress)) {
                                // Delete the token from tokens bought list since we no longer own the token
                                delete this.trackedTokens[tokenAddress];
                            }
                        }
                    }

                    console.log("[TRACK-TOKENS-BOUGHT]: Tokens have been updated", this.trackedTokens);
                } catch (error) {
                    console.log("Error saving or deleting bought or sold token", error);
                }

            });

        } catch (error) {
            console.log("Error listening for tokens ", error)
        }
    }
}

export const dbOperations = new DBOperations()