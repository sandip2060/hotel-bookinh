import { json } from "express";
import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhookHandler = async (req, res) => {
    try {
        console.log('🔔 Clerk Webhook received at:', new Date().toISOString());
        console.log('📨 Headers:', {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'] ? 'present' : 'missing',
            'content-type': req.headers['content-type']
        });
        console.log('📦 Body length:', req.body ? req.body.length : 0);
        
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        
        // Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // For raw body, use req.body directly
        const payload = req.body;
        
        // Verifying Headers
        const evt = await whook.verify(payload, headers);

        // Getting data from the verified event
        const {data, type} = evt;

        console.log('Webhook event type:', type);
        console.log('Webhook data:', data);

        // Ensure required data exists
        if (!data || !data.id) {
            console.log('Invalid webhook data received');
            return res.json({success: false, message: "Invalid webhook data"});
        }

        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || '',
            username: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            image: data.image_url || '',
        };

        // Switch Case for different types of events
        switch (type) {
            case "user.created": {
                console.log('👤 Creating new user:', userData.email);
                const newUser = await User.create(userData);
                console.log('✅ User created successfully in database:', newUser._id);
                console.log('📊 Total users now:', await User.countDocuments());
                break;
            }
            case "user.updated": {
                console.log('🔄 Updating user:', userData.email);
                await User.findByIdAndUpdate(data.id, userData);
                console.log('✅ User updated successfully in database');
                break;
            }
            case "user.deleted": {
                console.log('🗑️ Deleting user:', data.id);
                await User.findByIdAndDelete(data.id);
                console.log('✅ User deleted successfully from database');
                console.log('📊 Total users now:', await User.countDocuments());
                break;
            }
            default:
                console.log('Unhandled webhook event type:', type);
                break;
        }

        console.log('🎉 Webhook processed successfully');
        res.json({success: true, message: "Webhook processed successfully"});

    } catch (error) {
        console.error('Webhook error:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({success: false, message: error.message});
    }
};

export { clerkWebhookHandler };
export default clerkWebhookHandler;