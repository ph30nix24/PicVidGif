import mongoose from 'mongoose'
import dns from 'dns'

dns.setServers(["8.8.8.8", "8.8.4.4"]);  // force Node to use Google DNS
dns.setDefaultResultOrder("ipv4first"); 

const connectDb = async () => {
    try {
        const res = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB Connected: ${res.connection.host}`)
    } catch (e) {
        console.log("error while connecting to db: ", error.message);
        process.exit(1)
    }
}

export default connectDb