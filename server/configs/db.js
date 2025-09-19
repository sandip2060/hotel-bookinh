import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ Database Connected Successfully');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ Database connection error:', err.message);
            process.exit(1);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  Database disconnected. Attempting to reconnect...');
        });
        
        // Set connection options
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        
        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`, options);
        console.log('🚀 MongoDB connection established successfully');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

export default connectDB;