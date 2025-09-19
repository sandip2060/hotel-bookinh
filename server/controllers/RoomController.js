import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js"


// API to create a new room for a hotel
export const createRoom = async (req, res)=>{   
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId})

        if(!hotel) {
            console.log('No hotel found for user:', req.auth.userId);
            return res.json({ success: false, message: "No Hotel found"});
        }

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: "At least one image is required" });
        }

        console.log('Creating room for hotel:', hotel._id, 'Type:', roomType);

        // upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
           const response = await cloudinary.uploader.upload(file.path);
           return response.secure_url;
        })
        // Wait for all uploads to complete
       const images = await Promise.all(uploadImages)

       await Room.create({
        hotel: hotel._id,
        roomType,
        pricePerNight: +pricePerNight,
        amenities: JSON.parse(amenities),
        images,
       })
       
       console.log('Room created successfully for hotel:', hotel._id);
       res.json({success: true, message: "Room created successfully" })
    } catch (error) {
        console.error('Error creating room:', error.message);
        res.json({success: false, message: error.message })
    }
}


// API to get all rooms
export const getRooms = async (req, res)=>{
    try {
       const rooms = await Room.find({isAvailable: true}).populate({
        path: 'hotel',
        populate:{
            path: 'owner',
            select: 'image'
        }
       }).sort({created: -1 })
       res.json({success: true, rooms});
    } catch (error) {
        res.json({success: false, message: error.message});

    }
}


// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res)=>{
    try {
        const hotelData = await Hotel.findOne({owner: req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate
        ("hotel");
        res.json({success: true, rooms});
    } catch (error) {
        res.json({success: false, message: error.message});

    }
}


// API to to toggle availability of a room
export const toggleRoomAvailability = async (req, res)=>{
    try {
        const { roomId } = req.body;
        
        if (!roomId) {
            return res.json({success: false, message: "Room ID is required"});
        }
        
        console.log('Toggling availability for room:', roomId);
        const roomData = await Room.findById(roomId);
        
        if (!roomData) {
            return res.json({success: false, message: "Room not found"});
        }
        
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        
        console.log('Room availability updated:', roomId, 'Available:', roomData.isAvailable);
        res.json({ success: true, message: "Room availability Updated", isAvailable: roomData.isAvailable });
    } catch (error) {
        console.error('Error toggling room availability:', error.message);
        res.json({success: false, message: error.message});
    }
}