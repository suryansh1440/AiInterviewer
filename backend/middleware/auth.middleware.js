import jwt from "jsonwebtoken"
import User from "../modals/user.modal.js"
import mongoose from "mongoose"

// Database connection check middleware
export const checkDBConnection = async (req, res, next) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, attempting to reconnect...');
            // Try to reconnect
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                serverApi: {
                    version: '1',
                    strict: true,
                    deprecationErrors: true,
                }
            });
        }
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(503).json({ 
            message: 'Database connection error. Please try again later.',
            error: 'DB_CONNECTION_ERROR'
        });
    }
};

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};