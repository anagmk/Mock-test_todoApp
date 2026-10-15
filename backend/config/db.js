import mongoose from 'mongoose'

const connectDB =  async () => {
    await mongoose.connect(process.env.DATABASE_URI)
    console.log("connected db")
}

export default connectDB