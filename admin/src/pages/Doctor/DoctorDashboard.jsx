// import React from 'react'
// import { useContext } from 'react'
// import { useEffect } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'
// import { assets } from '../../assets/assets'
// import { AppContext } from '../../context/AppContext'

// const DoctorDashboard = () => {

//   const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
//   const { slotDateFormat, currency } = useContext(AppContext)


//   useEffect(() => {

//     if (dToken) {
//       getDashData()
//     }

//   }, [dToken])

//   return dashData && (
//     <div className='m-5'>

//       <div className='flex flex-wrap gap-3'>
//         <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
//           <img className='w-14' src={assets.earning_icon} alt="" />
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
//             <p className='text-gray-400'>Earnings</p>
//           </div>
//         </div>
//         <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
//           <img className='w-14' src={assets.appointments_icon} alt="" />
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
//             <p className='text-gray-400'>Appointments</p>
//           </div>
//         </div>
//         <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
//           <img className='w-14' src={assets.patients_icon} alt="" />
//           <div>
//             <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
//             <p className='text-gray-400'>Patients</p></div>
//         </div>
//       </div>

//       <div className='bg-white'>
//         <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
//           <img src={assets.list_icon} alt="" />
//           <p className='font-semibold'>Latest Bookings</p>
//         </div>

//         <div className='pt-4 border border-t-0'>
//           {dashData.latestAppointments.slice(0, 5).map((item, index) => (
//             <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
//               <img className='rounded-full w-10' src={item.userData.image} alt="" />
//               <div className='flex-1 text-sm'>
//                 <p className='text-gray-800 font-medium'>{item.userData.name}</p>
//                 <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
//               </div>
//               {item.cancelled
//                 ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
//                 : item.isCompleted
//                   ? <p className='text-green-500 text-xs font-medium'>Completed</p>
//                   : <div className='flex'>
//                     <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
//                     <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
//                   </div>
//               }
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   )
// }

// export default DoctorDashboard

import React from 'react';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register components with ChartJS
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend
);

const DoctorDashboard = ({
  males, females, diseases, patientCounts, bloodGroups, bloodGroupCounts,
  ageGroups, ageGroupCounts, adverseDrugs, drugCounts, dailyAppointments, appointmentsCounts
}) => {

  // Gender Distribution Data
  const genderData = {
    labels: ['Males', 'Females'],
    datasets: [
      {
        data: [males, females],
        backgroundColor: ['#4F46E5', '#EC4899'],
        hoverOffset: 4,
      },
    ],
  };

  // Disease Bar Chart Data
  const diseaseData = {
    labels: diseases,
    datasets: [
      {
        label: 'Number of Patients',
        data: patientCounts,
        backgroundColor: '#008000',
        borderColor: '#047857',
        borderWidth: 1,
      },
    ],
  };

  // Blood Group Pie Chart Data
  const bloodGroupData = {
    labels: bloodGroups,
    datasets: [
      {
        data: bloodGroupCounts,
        backgroundColor: ['#F59E0B', '#EF4444', '#3B82F6', '#34D399', '#A855F7', '#6366F1'],
        hoverOffset: 4,
      },
    ],
  };

  // Age Group Line Chart Data
  const ageGroupData = {
    labels: ageGroups,
    datasets: [
      {
        label: 'Number of People',
        data: ageGroupCounts,
        fill: false,
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 2,
        pointBackgroundColor: '#6D28D9',
        pointBorderColor: '#4C1D95',
      },
    ],
  };

  // Adverse Drug Reaction Bar Chart Data
  const adverseDrugData = {
    labels: adverseDrugs,
    datasets: [
      {
        label: 'Number of People Affected by ADR',
        data: drugCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Drug Effectiveness (%)',
        data: [85, 78, 65, 90], // Sample effectiveness data
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Immunization Status Bar Chart Data
  const immunizationStatusData = {
    labels: ['Hepatitis B', 'Measles', 'Polio', 'Diphtheria', 'Tetanus'], // Vaccine names
    datasets: [
      {
        label: 'Completed',
        data: [90, 80, 75, 85, 70], // Percentage of completed vaccinations
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: [10, 20, 25, 15, 30], // Percentage of pending vaccinations
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Healthcare Dashboard',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen px-8 pt-2 py-3 w-full">
      <h1 className="text-4xl font-bold text-gray-800 mb-5 text-center">Healthcare Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 p-4">
        {/* Registrations */}
        <div className="bg-blue-100 rounded-lg p-6 shadow-md flex flex-col items-start">
          <h3 className="text-sm font-medium text-gray-700">Total Appointments</h3>
          <div className="flex items-center mt-2">
            <h2 className="text-2xl font-bold text-gray-800">32</h2>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-blue-50 rounded-lg p-6 shadow-md flex flex-col items-start">
          <h3 className="text-sm font-medium text-gray-700">Completed Appointments</h3>
          <div className="flex items-center mt-2">
            <h2 className="text-2xl font-bold text-gray-800">20</h2>
          </div>
        </div>

        {/* Rating / Reviews */}
        <div className="bg-pink-50 rounded-lg p-6 shadow-md flex flex-col items-start">
          <h3 className="text-sm font-medium text-gray-700">Rating / Reviews</h3>
          <div className="flex items-center mt-2">
            <h2 className="text-2xl font-bold text-gray-800">⭐⭐⭐⭐⭐</h2>
            <span className="ml-2 text-green-500">+0</span>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-yellow-100 rounded-lg p-6 shadow-md flex flex-col items-start">
          <h3 className="text-sm font-medium text-gray-700">Payments</h3>
          <div className="flex items-center mt-2">
            <h2 className="text-2xl font-bold text-gray-800">₹ 2,350</h2>
            <span className="ml-2 text-green-500">+0</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
        {/* Gender Distribution Ring Chart */}
        <div className="bg-white flex flex-col justify-center items-center shadow-lg h-96 rounded-lg py-12">
          <h2 className="text-xl font-semibold mb-4 text-center">Gender Distribution</h2>
          <Doughnut data={genderData} />
        </div>

        {/* Disease Bar Chart */}
        <div className="bg-white flex flex-col justify-between px-4 items-center shadow-lg h-96 rounded-lg py-12">
          <h2 className="text-xl font-semibold mb-4 text-center">Patients by Disease</h2>
          <Bar data={diseaseData} options={options} />
        </div>

        {/* Blood Group Pie Chart */}
        <div className="bg-white flex flex-col justify-center items-center shadow-lg h-96 rounded-lg py-12">
          <h2 className="text-xl font-semibold mb-4 text-center">Blood Group Distribution</h2>
          <Pie data={bloodGroupData} />
        </div>

        {/* Age Group Line Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">People by Age Group</h2>
          <Line data={ageGroupData} options={options} />
        </div>

        {/* Adverse Drug Reactions Bar Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Adverse Drug Reactions</h2>
          <Bar data={adverseDrugData} options={options} />
        </div>

        {/* Immunization Status Bar Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Immunization Status</h2>
          <Bar data={immunizationStatusData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
