import React, { useEffect, useState, useCallback } from 'react'
import Title from '../../components/Title'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../../hooks/useAppContext.js'

const ListRoom = () => {

    const [rooms, setRooms] = useState([])
    const {axios, getToken, user, currency} = useAppContext()

    // Fetch rooms of the hotel owner
    const fetchRooms = useCallback(async()=>{
        try {
            const { data } = await axios.get('/api/rooms/owner', {headers: 
                {Authorization: `Bearer ${await getToken()}`}})
            if(data.success){
                setRooms(data.rooms)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios, getToken])

    // Toggle Availability of the Room
    const toggleAvailability = async(roomId)=>{
        try {
            const {data} = await axios.post('/api/rooms/toggle-availability', {roomId},
            {headers: {Authorization: `Bearer ${await getToken()}`}})
            if(data.success){
                toast.success(data.message)
                fetchRooms()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(user){
            fetchRooms()
        }
    },[user, fetchRooms])

  return (
    <div>
        <Title align='left' font='outfit' title='Room Listings' subTitle='View, edit, or manage all listed rooms.
        Keep the information up-to-date to provide better experiences for users.' />
        <p className='text-gray-500 mt-8'>All Rooms</p>
        <div className='w-full max-w-3xl text-left border border-gray-300
        rounded-lg max-h-80 overflow-y-scroll mt-3'>
             <table className='w-full'>
             <thead className='bg-gray-50'>
                  <tr>
                      <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                      <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                      <th className='py-3 px-4 text-gray-800 font-medium '>Price / night</th>
                      <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                   </tr>
             </thead>
             <tbody className='text-sm'>
                {
                    rooms.map((item, index)=>(
                        <tr key={index}>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                {item.roomType}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                {item.amenities.join(', ')}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                {currency} {item.pricePerNight}
                            </td>
                            <td className='py-3 px-4 border-t border-gray-300 text-sm text-center'>
                                <label className='relative inline-flex items-center cursor-pointer gap-3'>
                                    <input 
                                        onChange={() => toggleAvailability(item._id)} 
                                        type="checkbox" 
                                        className='sr-only peer' 
                                        checked={item.isAvailable} 
                                    />
                                    
                                    {/* Left-to-Right Slidable Toggle */}
                                    <div className='relative w-16 h-8 bg-gray-300 rounded-full 
                                                    peer-checked:bg-green-500 transition-all duration-400 ease-in-out 
                                                    shadow-inner border border-gray-200 peer-checked:border-green-400'>
                                        
                                        {/* Sliding Button */}
                                        <div className={`absolute top-0.5 w-7 h-7 bg-white rounded-full shadow-lg 
                                                        transition-all duration-400 ease-in-out flex items-center justify-center 
                                                        border border-gray-200 ${
                                            item.isAvailable 
                                                ? 'left-8 bg-green-50 border-green-300' 
                                                : 'left-0.5 bg-white border-gray-200'
                                        }`}>
                                            
                                            {/* Status Indicator */}
                                            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                                item.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></div>
                                        </div>
                                        
                                        {/* Track Labels */}
                                        <div className='absolute inset-0 flex items-center justify-between px-2'>
                                            <span className={`text-xs font-semibold transition-opacity duration-300 ${
                                                item.isAvailable ? 'opacity-0' : 'opacity-70 text-gray-600'
                                            }`}></span>
                                            <span className={`text-xs font-semibold transition-opacity duration-300 ${
                                                item.isAvailable ? 'opacity-90 text-white' : 'opacity-0'
                                            }`}></span>
                                        </div>
                                    </div>
                                    
                                    {/* Status Text */}
                                    <span className={`text-sm font-medium transition-colors duration-300 ${
                                        item.isAvailable ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                        {/* {item.isAvailable ? '✓ Available' : '✗ Unavailable'} */}
                                    </span>
                                </label>
                            </td>
                        </tr>
                    ))
                }

             </tbody>
             </table>
        </div>
    </div>
  )
}

export default ListRoom