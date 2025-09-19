import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    try {
        const {userId} = req.auth;
        console.log('Auth middleware - userId:', userId);
        if(!userId){
            return res.json({success: false, message: "not authenticated"})
        }
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found in database:', userId);
            return res.json({success: false, message: "User not found"})
        }
        console.log('User authenticated successfully:', user._id, 'Role:', user.role);
        req.user = user;
        next()
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.json({success: false, message: "Authentication error"})
    }
}