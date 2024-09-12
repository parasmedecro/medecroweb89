import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(false);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [slotDuration, setSlotDuration] = useState(30); // Default duration

    const navigate = useNavigate();

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfo);
    };

    const getAvailableSlots = async () => {
        setDocSlots([]);

        let today = new Date();

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();

                const slotDate = day + "_" + month + "_" + year;
                const slotTime = formattedTime;

                const isSlotBooked = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime);

                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime,
                    isBooked: isSlotBooked
                });

                currentDate.setMinutes(currentDate.getMinutes() + slotDuration);
            }

            setDocSlots(prev => ([...prev, timeSlots]));
        }
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment');
            return navigate('/login');
        }

        const date = docSlots[slotIndex][0].datetime;
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const slotDate = day + "_" + month + "_" + year;

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getDoctosData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo();
        }
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo, slotDuration]);

    return docInfo ? (
        <div>
            <div className='flex flex-col sm:flex-row gap-6'>
                {/* Left Image Section */}
                <div className='w-full sm:w-72 h-80'>
                    <img
                        className='w-full h-full object-cover rounded-lg'
                        src={docInfo.image}
                        alt={docInfo.name}
                    />
                </div>

                {/* Right Info Section */}
                <div className='flex-1 border border-[#ADADAD] rounded-lg p-6 sm:p-8 bg-white'>
                    {/* Doc Info: name, degree, experience */}
                    <p className='flex items-center gap-2 text-2xl sm:text-3xl font-semibold text-gray-800'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="Verified" />
                    </p>

                    <div className='flex items-center gap-2 mt-2 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-1 px-3 border text-xs rounded-full bg-gray-100'>{docInfo.experience}</button>
                    </div>

                    {/* About Section */}
                    <div className='mt-4'>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-800'>
                            About <img className='w-3' src={assets.info_icon} alt="Info" />
                        </p>
                        <p className='text-sm text-gray-600 leading-relaxed mt-1'>{docInfo.about}</p>
                    </div>

                    {/* Appointment Fee */}
                    <p className='mt-4 text-gray-600 font-medium'>
                        Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className='flex flex-col sm:flex-row gap-6 mt-8 font-medium text-[#565656]'>
                {/* Duration Dropdown */}
                <div className='mb-4'>
                    <label htmlFor='duration' className='block text-sm font-medium text-gray-700'>Select Slot Duration</label>
                    <select
                        id='duration'
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm'
                        value={slotDuration}
                        onChange={(e) => setSlotDuration(Number(e.target.value))}
                    >
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                    </select>
                </div>

                {/* Booking Slots */}
                <div className='flex-1'>
                    <p className='text-lg font-semibold mb-4'>Booking Slots</p>

                    {/* Days Slots */}
                    <div className='flex gap-3 items-center w-full overflow-x-auto mb-4'>
                        {docSlots.length > 0 && docSlots.map((item, index) => (
                            <div
                                onClick={() => setSlotIndex(index)}
                                key={index}
                                className={`text-center py-2 px-4 min-w-20 max-w-[80px] rounded-full cursor-pointer transition-colors duration-300 ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD] text-gray-600'}`}
                            >
                                <p className='text-xs font-medium'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p className='text-sm font-semibold'>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Time Slots */}
                    <div className='flex flex-wrap gap-3 w-full mb-6'>
                        {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                            <p
                                onClick={() => setSlotTime(item.time)} // Set the selected time slot
                                key={index}
                                className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-colors duration-300 
            ${item.isBooked ? 'bg-red-500 text-white'
                                        : item.time === slotTime ? 'bg-blue-500 text-white' // Highlight selected slot in blue
                                            : 'bg-green-500 text-white'}`} // Available slots in green
                            >
                                {item.time.toLowerCase()}
                            </p>
                        ))}
                    </div>


                    <button
                        onClick={bookAppointment}
                        className='bg-primary text-white text-sm font-semibold px-6 py-3 rounded-lg transition-transform transform hover:scale-105'
                    >
                        Book an Appointment
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default Appointment;
