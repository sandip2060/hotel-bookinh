
// Get /api/user/
export const getUserData = async (req, res) => {
    try {
        console.log('Getting user data for:', req.user._id);
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        console.log('User role:', role, 'Recent cities:', recentSearchedCities);
        res.json({success: true, role, recentSearchedCities})
    } catch (error) {
        console.error('Error getting user data:', error.message);
        res.json({success: false, message: error.message})
        
    }
}

// Store User Recent Searched Cities
export const storeRecentSearchedCities = async (req, res)=>{
    try {
        const {recentSearchedCity} = req.body
        const user = req.user;

        if(user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedCity)
        }else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity)
        }
        await user.save();
        res.json({success: true, message: "city added"})

    } catch (error) {
        res.json({success: false, message: error.message })
    }
};