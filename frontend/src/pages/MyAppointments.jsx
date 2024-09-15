import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const UPIID = import.meta.env.VITE_UPI;
    const { backendUrl, token ,userData} = useContext(AppContext)
    const navigate = useNavigate()
    const [showQRModal, setShowQRModal] = useState(false);
    const [upiAmount, setUpiAmount] = useState(''); // Store the amount for the QR
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [newSlotDate, setNewSlotDate] = useState('');
    const [newSlotTime, setNewSlotTime] = useState('');
    const [OldAppointmentId, setOldAppointmentId] = useState('');
    const [appointments, setAppointments] = useState([])
    const [userid, setuserid] = useState('');
    const [payment, setPayment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        console.log('Input slotDate:', slotDate); // Log input for debugging

        // Ensure slotDate is a string and has the expected format
        if (typeof slotDate !== 'string') {
            console.error('Invalid slotDate format:', slotDate);
            return 'Invalid date';
        }

        // Split the date string using '_'
        const dateArray = slotDate.split('_');
        console.log('Split dateArray:', dateArray); // Log split result

        // Check if dateArray has exactly 3 parts
        if (dateArray.length !== 3) {
            console.error('Unexpected slotDate format:', slotDate);
            return 'Invalid date';
        }

        // Destructure the parts
        const [day, monthIndex, year] = dateArray;
        console.log('Day:', day, 'Month Index:', monthIndex, 'Year:', year); // Log parts

        // Convert monthIndex to zero-based index
        const monthIndexNumber = Number(monthIndex);
        if (isNaN(monthIndexNumber) || monthIndexNumber < 1 || monthIndexNumber > 12) {
            console.error('Invalid month index:', monthIndex);
            return 'Invalid date';
        }

        const month = months[monthIndexNumber - 1];
        console.log('Month:', month); // Log month

        // Format and return the date
        return `${day} ${month} ${year}`;
    };

    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        // Convert month to a number to remove leading zeros
        const formattedMonth = parseInt(month, 10);
        return `${day}_${formattedMonth}_${year}`;
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = ((hours % 12) || 12).toString().padStart(2, '0');
        return `${formattedHours}:${minutes} ${period}`;
      };
      

    const ReAppointment = async (userId,docname) => {
        try {
            const newslotDateFormatted = formatDate(newSlotDate);
            const formattedTime = formatTime("16:00");
            // const formattedTime = formatTime(newSlotTime);
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', 
                { 
                    userId:userId,
                    oldappointmentId:OldAppointmentId, 
                    newslotDate: newslotDateFormatted, 
                    newslotTime:formattedTime
                }, 
                { headers: { token } }
            );
            // setShowRescheduleModal(false)
            if (data.success) {
                toast.success(data.message);
                let msg = 'rescheduled'
                let slotTime=formattedTime
                let slotDate = newslotDateFormatted
                let username = userData.name
                let chatid = userData.chatid

                await axios.post(backendUrl+'/api/telegram/sendtelappointmentmsg',{slotTime,slotDate,docname,username,chatid,msg})
                getUserAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    
    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentUPI = async (Fees) => {
        try {
            setUpiAmount(Fees);
            setShowQRModal(true); // Show the QR modal when UPI is clicked
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img
                                className="w-48 h-48 object-cover rounded-md bg-[#EAEFFF]"
                                src={item.docData.image}
                                alt="Doctor Image"
                            />

                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p className=''>{item.docData.address.line1}</p>
                            <p className=''>{item.docData.address.line2}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id &&
                                <button
                                    onClick={() => setPayment(item._id)}
                                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                                    Pay Online
                                </button>
                            }
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <button
                                    onClick={() => appointmentUPI(item.amount)}
                                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-black transition-all duration-300 flex items-center justify-center'>
                                    <span className='max-w-20 max-h-5'>UPI QR</span>
                                </button>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id &&
                                <button
                                    onClick={() => appointmentRazorpay(item._id)}
                                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                                    <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" />
                                </button>
                            }
                            {!item.cancelled && item.payment && !item.isCompleted &&
                                <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>
                                    Paid
                                </button>
                            }
                            {item.isCompleted &&
                                <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                                    Completed
                                </button>
                            }
                            {!item.cancelled && !item.isCompleted &&
                                <button
                                    onClick={() => {
                                        setOldAppointmentId(item._id); // Store the appointment ID
                                        setShowRescheduleModal(true); // Show the reschedule modal
                                        
                                        setuserid(String(item.userId));

                                    }}
                                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                                    Reschedule appointment
                                </button>

                            }
                            {item.cancelled && !item.isCompleted &&
                                <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                                    Reschedule Appointment
                                </button>
                            }
                        </div>

                        {showQRModal && (
                            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
                                <div className="bg-white rounded-xl p-8 relative w-96 shadow-2xl transition-all duration-300">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Scan UPI QR Code</h2>
                                    <div className="flex justify-center mb-6">
                                        {/* Replace with your actual QR code generation */}
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${UPIID}&pn=MEDPLUS&am=${upiAmount}&cu=INR`)}`}
                                            alt="UPI QR Code"
                                            className="w-48 h-48 rounded-md shadow-md"
                                        />
                                    </div>
                                    <p className="text-center text-lg font-medium text-gray-700 mb-4">Amount: ₹{upiAmount}</p>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setShowQRModal(false)}
                                            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showRescheduleModal && (
                            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
                                <div className="bg-white rounded-xl p-8 relative w-96 shadow-2xl transition-all duration-300">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reschedule Appointment</h2>

                                    {/* Date Selector */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Select New Date:</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded"
                                            value={newSlotDate}
                                            onChange={(e) => setNewSlotDate(e.target.value)}
                                        />
                                    </div>

                                    {/* Time Selector */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Select New Time:</label>
                                        <input
                                            type="time"
                                            className="w-full p-2 border rounded"
                                            value={newSlotTime}
                                            onChange={(e) => setNewSlotTime(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => ReAppointment(userid,item.docData.name)}
                                            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
                                        >
                                            Confirm Reschedule
                                        </button>
                                        <button
                                            onClick={() => setShowRescheduleModal(false)}
                                            className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-all duration-300 shadow-md ml-4"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments