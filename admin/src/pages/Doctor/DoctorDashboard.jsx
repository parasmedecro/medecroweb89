// // import React from 'react';
// // import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';
// // import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// // // Register components with ChartJS
// // ChartJS.register(
// //   CategoryScale, 
// //   LinearScale, 
// //   BarElement, 
// //   ArcElement, 
// //   PointElement, 
// //   LineElement, 
// //   Tooltip, 
// //   Legend
// // );

// // const DoctorDashboard = ({
// //   males, females, diseases, patientCounts, bloodGroups, bloodGroupCounts,
// //   ageGroups, ageGroupCounts, adverseDrugs, drugCounts, dailyAppointments, appointmentsCounts
// // }) => {

// //   // Gender Distribution Data
// //   const genderData = {
// //     labels: ['Males', 'Females'],
// //     datasets: [
// //       {
// //         data: [males, females],
// //         backgroundColor: ['#4F46E5', '#EC4899'],
// //         hoverOffset: 4,
// //       },
// //     ],
// //   };

// //   // Disease Bar Chart Data
// //   const diseaseData = {
// //     labels: diseases,
// //     datasets: [
// //       {
// //         label: 'Number of Patients',
// //         data: patientCounts,
// //         backgroundColor: '#008000',
// //         borderColor: '#047857',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   // Blood Group Pie Chart Data
// //   const bloodGroupData = {
// //     labels: bloodGroups,
// //     datasets: [
// //       {
// //         data: bloodGroupCounts,
// //         backgroundColor: ['#F59E0B', '#EF4444', '#3B82F6', '#34D399', '#A855F7', '#6366F1'],
// //         hoverOffset: 4,
// //       },
// //     ],
// //   };

// //   // Age Group Line Chart Data
// //   const ageGroupData = {
// //     labels: ageGroups,
// //     datasets: [
// //       {
// //         label: 'Number of People',
// //         data: ageGroupCounts,
// //         fill: false,
// //         backgroundColor: '#8B5CF6',
// //         borderColor: '#7C3AED',
// //         borderWidth: 2,
// //         pointBackgroundColor: '#6D28D9',
// //         pointBorderColor: '#4C1D95',
// //       },
// //     ],
// //   };

// //   // Adverse Drug Reaction Bar Chart Data
// //   const adverseDrugData = {
// //     labels: adverseDrugs,
// //     datasets: [
// //       {
// //         label: 'Number of People Affected by ADR',
// //         data: drugCounts,
// //         backgroundColor: 'rgba(255, 99, 132, 0.2)',
// //         borderColor: 'rgba(255, 99, 132, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'Drug Effectiveness (%)',
// //         data: [85, 78, 65, 90], // Sample effectiveness data
// //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
// //         borderColor: 'rgba(75, 192, 192, 1)',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   // Immunization Status Bar Chart Data
// //   const immunizationStatusData = {
// //     labels: ['Hepatitis B', 'Measles', 'Polio', 'Diphtheria', 'Tetanus'], // Vaccine names
// //     datasets: [
// //       {
// //         label: 'Completed',
// //         data: [90, 80, 75, 85, 70], // Percentage of completed vaccinations
// //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
// //         borderColor: 'rgba(75, 192, 192, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'Pending',
// //         data: [10, 20, 25, 15, 30], // Percentage of pending vaccinations
// //         backgroundColor: 'rgba(255, 99, 132, 0.2)',
// //         borderColor: 'rgba(255, 99, 132, 1)',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   const options = {
// //     responsive: true,
// //     plugins: {
// //       legend: {
// //         position: 'top',
// //       },
// //       title: {
// //         display: true,
// //         text: 'Healthcare Dashboard',
// //       },
// //     },
// //     scales: {
// //       y: {
// //         beginAtZero: true,
// //       },
// //     },
// //   };

// //   return (
// //     <div className="bg-gray-50 min-h-screen px-8 pt-2 py-3 w-full">
// //       <h1 className="text-4xl font-bold text-gray-800 mb-5 text-center">Healthcare Dashboard</h1>
// //       <div className="grid grid-cols-4 gap-4 p-4">
// //         {/* Registrations */}
// //         <div className="bg-blue-100 rounded-lg p-6 shadow-md flex flex-col items-start">
// //           <h3 className="text-sm font-medium text-gray-700">Total Appointments</h3>
// //           <div className="flex items-center mt-2">
// //             <h2 className="text-2xl font-bold text-gray-800">32</h2>
// //           </div>
// //         </div>

// //         {/* Total Views */}
// //         <div className="bg-blue-50 rounded-lg p-6 shadow-md flex flex-col items-start">
// //           <h3 className="text-sm font-medium text-gray-700">Completed Appointments</h3>
// //           <div className="flex items-center mt-2">
// //             <h2 className="text-2xl font-bold text-gray-800">20</h2>
// //           </div>
// //         </div>

// //         {/* Rating / Reviews */}
// //         <div className="bg-pink-50 rounded-lg p-6 shadow-md flex flex-col items-start">
// //           <h3 className="text-sm font-medium text-gray-700">Rating / Reviews</h3>
// //           <div className="flex items-center mt-2">
// //             <h2 className="text-2xl font-bold text-gray-800">⭐⭐⭐⭐⭐</h2>
// //             <span className="ml-2 text-green-500">+0</span>
// //           </div>
// //         </div>

// //         {/* Payments */}
// //         <div className="bg-yellow-100 rounded-lg p-6 shadow-md flex flex-col items-start">
// //           <h3 className="text-sm font-medium text-gray-700">Payments</h3>
// //           <div className="flex items-center mt-2">
// //             <h2 className="text-2xl font-bold text-gray-800">₹ 2,350</h2>
// //             <span className="ml-2 text-green-500">+0</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Dashboard Grid for Charts */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
// //         {/* Gender Distribution Ring Chart */}
// //         <div className="bg-white flex flex-col justify-center items-center shadow-lg h-96 rounded-lg py-12">
// //           <h2 className="text-xl font-semibold mb-4 text-center">Gender Distribution</h2>
// //           <Doughnut data={genderData} />
// //         </div>

// //         {/* Disease Bar Chart */}
// //         <div className="bg-white flex flex-col justify-between px-4 items-center shadow-lg h-96 rounded-lg py-12">
// //           <h2 className="text-xl font-semibold mb-4 text-center">Patients by Disease</h2>
// //           <Bar data={diseaseData} options={options} />
// //         </div>

// //         {/* Blood Group Pie Chart */}
// //         <div className="bg-white flex flex-col justify-center items-center shadow-lg h-96 rounded-lg py-12">
// //           <h2 className="text-xl font-semibold mb-4 text-center">Blood Group Distribution</h2>
// //           <Pie data={bloodGroupData} />
// //         </div>

// //         {/* Age Group Line Chart */}
// //         <div className="bg-white shadow-lg rounded-lg p-6">
// //           <h2 className="text-xl font-semibold mb-4 text-center">People by Age Group</h2>
// //           <Line data={ageGroupData} options={options} />
// //         </div>

// //         {/* Adverse Drug Reactions Bar Chart */}
// //         <div className="bg-white shadow-lg rounded-lg p-6">
// //           <h2 className="text-xl font-semibold mb-4 text-center">Adverse Drug Reactions</h2>
// //           <Bar data={adverseDrugData} options={options} />
// //         </div>

// //         {/* Immunization Status Bar Chart */}
// //         <div className="bg-white shadow-lg rounded-lg p-6">
// //           <h2 className="text-xl font-semibold mb-4 text-center">Immunization Status</h2>
// //           <Bar data={immunizationStatusData} options={options} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DoctorDashboard;





// import React, { useState } from 'react';
// import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// // Register components with ChartJS
// ChartJS.register(
//   CategoryScale, 
//   LinearScale, 
//   BarElement, 
//   ArcElement, 
//   PointElement, 
//   LineElement, 
//   Tooltip, 
//   Legend
// );

// const DoctorDashboard = ({
//   males, females, diseases, bloodGroups, bloodGroupCounts,
//   ageGroups, ageGroupCounts, adverseDrugs, drugCounts
// }) => {
//   // State for disease selection and slider values
//   const [selectedDisease, setSelectedDisease] = useState(diseases[0]);
//   const [sliderValues, setSliderValues] = useState([0, 0, 0, 0, 0]);

//   // Disease Bar Chart Data dynamically updating
//   const diseaseData = {
//     labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
//     datasets: [
//       {
//         label: `Patients Affected by ${selectedDisease}`,
//         data: sliderValues,
//         backgroundColor: sliderValues.map(val => val > 50 ? '#FF0000' : '#008000'),
//         borderColor: '#047857',
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Handle slider change
//   const handleSliderChange = (index, value) => {
//     const newValues = [...sliderValues];
//     newValues[index] = parseInt(value);
//     setSliderValues(newValues);
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: `Healthcare Dashboard for ${selectedDisease}`,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen px-8 pt-2 py-3 w-full">
//       <h1 className="text-4xl font-bold text-gray-800 mb-5 text-center">Healthcare Dashboard</h1>

//       {/* Dashboard Grid for Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
//         {/* Disease Bar Chart */}
//         <div className="bg-white flex flex-col justify-between px-4 items-center shadow-lg h-96 rounded-lg py-12">
//           <h2 className="text-xl font-semibold mb-4 text-center">Patients by Disease</h2>
//           <Bar data={diseaseData} options={options} />
//           {sliderValues.some(val => val > 50) && (
//             <div className="bg-red-100 p-4 rounded-md mt-4 shadow-md w-full text-center">
//               <h3 className="text-red-500 font-bold">⚠️ Potential Epidemic Alert: {selectedDisease}</h3>
//               <p className="text-gray-700">More than 50 people affected in one or more days.</p>
//             </div>
//           )}
//         </div>

//         {/* Disease Slider Section */}
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 text-center">Track {selectedDisease} Over 5 Days</h2>
//           <div className="flex flex-col items-center">
//             {[...Array(5)].map((_, index) => (
//               <div key={index} className="mb-4 w-full">
//                 <label className="block text-gray-700 text-sm font-medium mb-1">
//                   Day {index + 1} - Patients: {sliderValues[index]}
//                 </label>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   value={sliderValues[index]}
//                   onChange={(e) => handleSliderChange(index, e.target.value)}
//                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;








import React, { useState } from 'react';
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
  // State for disease selection and slider values
  const [selectedDisease, setSelectedDisease] = useState(diseases[0]);
  const [sliderValues, setSliderValues] = useState([0, 0, 0, 0, 0]);

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

  // Disease Bar Chart Data dynamically updating with slider values
  const dynamicDiseaseData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [
      {
        label: `Patients Affected by ${selectedDisease}`,
        data: sliderValues,
        backgroundColor: sliderValues.map(val => val > 50 ? '#FF0000' : '#008000'),
        borderColor: '#047857',
        borderWidth: 1,
      },
    ],
  };

  // Handle slider change
  const handleSliderChange = (index, value) => {
    const newValues = [...sliderValues];
    newValues[index] = parseInt(value);
    setSliderValues(newValues);
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

        {/* Immunization Status Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Immunization Status</h2>
          <Bar data={immunizationStatusData} options={options} />
        </div>
      </div>

     {/* Disease Slider for Epidemic Detection */}
<div className="flex gap-8 mt-6 p-6 bg-white shadow-md rounded-lg">
  <div className="flex flex-col w-full md:w-2/3">
    <h2 className="text-xl font-semibold mb-4">Disease Trend Tracker</h2>
    {/* Dynamic Disease Trend Chart */}
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Patients Affected by {selectedDisease}</h2>
      <Bar data={dynamicDiseaseData} options={options} />
    </div>
  </div>

  <div className="flex flex-col w-full md:w-1/3">
    <div className="flex flex-col">
      <label htmlFor="diseaseSelect" className="block mb-2 text-sm font-medium text-gray-700">Select Disease</label>
      <select
        id="diseaseSelect"
        value={selectedDisease}
        onChange={(e) => setSelectedDisease(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {diseases.map((disease, index) => (
          <option key={index} value={disease}>{disease}</option>
        ))}
      </select>
    </div>

    {/* Sliders for Disease Trend */}
    <div className="flex flex-col mt-6 space-y-4">
      {sliderValues.map((value, index) => (
        <div key={index} className="flex flex-col items-center">
          <label htmlFor={`slider-${index}`} className="block mb-2 text-sm font-medium text-gray-700">Day {index + 1}</label>
          <input
            id={`slider-${index}`}
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleSliderChange(index, e.target.value)}
            className="w-full appearance-none h-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span className="mt-2 text-sm">{value}</span>
        </div>
      ))}
    </div>

    {/* Epidemic Alert Logic */}
    {sliderValues.some(val => val > 50) && (
      <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <strong>Alert!</strong> More than 50 patients affected by {selectedDisease} over the past 5 days. Potential epidemic detected.
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default DoctorDashboard;
