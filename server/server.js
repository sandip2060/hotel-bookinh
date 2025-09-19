import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import webhookRouter from "./routes/webhookRoutes.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";


connectDB()
connectCloudinary();


const app = express()
app.use(cors()) //Enable Cross-Origin Resource Sharing

// Raw body parsing for webhooks BEFORE express.json()
app.use("/api/clerk", express.raw({type: "application/json"}), webhookRouter);

// Middleware
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("API is working"))
app.get('/api/test', async (req, res) => {
    try {
        const User = (await import('./models/User.js')).default;
        const userCount = await User.countDocuments();
        res.json({success: true, message: `Database connected. Users in DB: ${userCount}`});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
})
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
