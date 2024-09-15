import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='bg-gray-50 min-h-screen py-10'>
            <div className='flex flex-col sm:flex-row gap-6 sm:gap-10 max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-lg'>
    
                {/* Profile Image */}
                <div className='flex-shrink-0'>
                    <img className='w-full sm:max-w-[250px] h-auto rounded-lg shadow-md object-cover' src={profileData.image} alt={profileData.name} />
                </div>
    
                {/* Profile Details */}
                <div className='flex-1 border border-stone-100 rounded-lg p-8 bg-white shadow-sm'>
    
                    {/* Doctor Info: name, degree, experience */}
                    <div className='text-gray-700'>
                        <p className='text-3xl font-semibold'>{profileData.name}</p>
                        <p className='text-xl font-medium mt-1'>Phone: {profileData.number}</p>
                    </div>
                    
                    <div className='mt-3 text-gray-600 flex items-center gap-2'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-1 px-3 border rounded-full text-xs bg-gray-100'>{profileData.experience} years</button>
                    </div>
    
                    {/* About Section */}
                    <div className='mt-5'>
                        <p className='text-sm font-semibold text-gray-700'>About:</p>
                        <p className='text-sm text-gray-600 mt-1'>
                            {isEdit
                                ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} type='text' className='w-full outline-none p-3 border border-gray-200 rounded-lg resize-none' rows={6} value={profileData.about} />
                                : profileData.about}
                        </p>
                    </div>
    
                    {/* Appointment Fee */}
                    <div className='mt-5'>
                        <p className='text-gray-600 font-medium'>
                            Appointment Fee: <span className='text-gray-800'>{currency} {isEdit
                                ? <input type='number' className='ml-2 p-1 border border-gray-200 rounded-lg' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} />
                                : profileData.fees}</span>
                        </p>
                    </div>
    
                    {/* Address Section */}
                    <div className='mt-4'>
                        <p className='text-gray-600 font-medium'>Address:</p>
                        <div className='text-sm text-gray-600 mt-1'>
                            {isEdit 
                                ? <input type='text' className='w-full p-2 border border-gray-200 rounded-lg mt-1' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                                : <p>{profileData.address.line1}</p>}
                            {isEdit 
                                ? <input type='text' className='w-full p-2 border border-gray-200 rounded-lg mt-1' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                                : <p>{profileData.address.line2}</p>}
                        </div>
                    </div>
    
                    {/* Availability Checkbox */}
                    <div className='mt-4 flex items-center'>
                        <input type="checkbox" className='w-5 h-5' onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                        <label className='ml-2 text-gray-700'>Available</label>
                    </div>
    
                    {/* Edit/Save Button */}
                    <div className='mt-6'>
                        {isEdit
                            ? <button onClick={updateProfile} className='px-6 py-2 bg-primary text-white rounded-full shadow-sm hover:bg-primary/90 transition-all'>Save</button>
                            : <button onClick={() => setIsEdit(prev => !prev)} className='px-6 py-2 border border-primary text-primary rounded-full shadow-sm hover:bg-primary hover:text-white transition-all'>Edit</button>}
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default DoctorProfile