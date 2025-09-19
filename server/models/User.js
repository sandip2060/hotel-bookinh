import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    username: {type: String, required: true, default: 'Anonymous User'},
    email: {type: String, required: true, unique: true},
    image: {type: String, default: ''},
    role: {type: String, enum:["user", "hotel-owner"], default: "user"},
    recentSearchedCities: [{type: String}],
},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;