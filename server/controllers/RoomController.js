import Hotel from "../models/Hotel";


// API to create a new room for a hotel
export const createRoom = async (req, res)=>{
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId})

        if(!hotel) return res.json({ success: false, message: "No Hotel found"});

        
    } catch (error) {
        
    }
}


// API to get all rooms
export const getRooms = async (req, res)=>{
    
}


// API to get a specific hotel
export const getOwnerRooms = async (req, res)=>{
    
}


// API to to toggle availability of a room
export const toggleRoomAvailability = async (req, res)=>{
    
}