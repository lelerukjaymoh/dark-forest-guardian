import { streamer } from "./streamer/stream"

const main = () => {
    try {

        // Fetch new tokens from the    

        streamer.stream()
    } catch (error) {
        console.log("Error in main function ", error)
    }
}