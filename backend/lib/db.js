import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () => {
    try {
        // Connection options for production deployment
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log("Connected to MongoDB", conn.connection.host);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        // In production, don't exit the process, let it retry
        if (process.env.NODE_ENV === 'production') {
            console.log("Retrying connection in 5 seconds...");
            setTimeout(connectDB, 5000);
        } else {
            process.exit(1);
        }
    }
}