import React, { useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components for Blood Sugar chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const MergedHealthDashboard = () => {
  const [circles, setCircles] = useState([]);

  const systolic = 120;
  const diastolic = 80;
  const isNormalBP = systolic <= 120 && diastolic <= 80;

  const latestReading = 120;
  const averageReading = 133;

  const data = {
    labels: ['01/01', '01/02', '01/03', '01/04', '01/05'],
    datasets: [
      {
        label: 'Blood Sugar (mg/dL)',
        data: [110, 145, 130, 160, 120],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
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
        text: 'Blood Sugar Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 60,
        suggestedMax: 200,
      },
    },
  };

  const getReadingColor = (reading) => {
    if (reading < 70) return 'text-red-500';
    if (reading >= 70 && reading <= 140) return 'text-green-500';
    return 'text-yellow-500';
  };

  const handleImageClick = (event) => {
    if (circles.length === 5) {
      setCircles([]);
    } else {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const existingCircleIndex = circles.findIndex(
        (circle) => Math.abs(circle.x - x) < 25 && Math.abs(circle.y - y) < 25
      );

      if (existingCircleIndex !== -1) {
        const updatedCircles = circles.filter((_, index) => index !== existingCircleIndex);
        setCircles(updatedCircles);
      } else {
        if (circles.length < 5) {
          setCircles([...circles, { x, y }]);
        }
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-2  flex flex-col justify-evenly lg:flex-row gap-6">
      {/* Pain Map Section */}
           <div className='flex flex-col  h-[100%] justify-center items-center'>
           <h2 className="text-2xl font-bold ">Pain Spots</h2>

<div className="relative bg-gray-300 p-6 rounded-lg shadow-lg flex-1 h-[720px]">
  {/* <h2 className="text-2xl font-bold mb-4">Pain Map</h2> */}
  <div className="relative h-full">
    <img
      src="/image.png" // Replace with your image path
      alt="Body Map"
      onClick={handleImageClick}
      className="w-full h-full cursor-pointer object-cover"
    />
    {circles.map((circle, index) => (
      <div
        key={index}
        className="absolute w-12 h-12 bg-red-500 rounded-full opacity-75"
        style={{
          left: `${circle.x - 25}px`,
          top: `${circle.y - 25}px`,
        }}
      />
    ))}
  </div>
</div>
           </div>

      <div className='gap-3 flex'>
        
      <div className="flex flex-col  flex-1 gap-6">
        {/* Blood Pressure Section */}
        <div className="bg-white px-6 rounded-lg shadow-lg flex flex-col justify-between h-[44%]">
          <div>
            <h2 className="text-2xl font-bold mb-4">Blood Pressure</h2>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">
                {systolic}/{diastolic} <span className="text-lg">mmHg</span>
              </div>
              <p className={`text-xl ${isNormalBP ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                {isNormalBP ? 'Normal' : 'High'}
              </p>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <GaugeChart
              id="gauge-chart1"
              nrOfLevels={4}
              arcsLength={[0.25, 0.25, 0.25, 0.25]} // Four sections
              colors={['#5BE12C', '#F5CD19', '#EA4228', '#D80000']} // Green to Red
              percent={systolic / 180} // Normalized to max systolic value
              arcPadding={0.02}
              textColor="#000"
              needleColor="#464A4F"
              needleBaseColor="#464A4F"
            />
          </div>
        </div>

        {/* Blood Sugar Section */}
        <div className="flex justify-center items-center bg-white px-6 rounded-lg shadow-lg flex flex-col justify-between h-[50%]">
          <div>
            <h2 className="text-2xl font-bold mb-1">Blood Sugar</h2>
            <div className='flex gap-6'>
            <div className="mb-6">
              <h2 className="text-xl font-semibold ">Latest Blood Sugar</h2>
              <p className={`text-4xl font-bold ${getReadingColor(latestReading)}`}>
                {latestReading} mg/dL
              </p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Average Blood Sugar</h2>
              <p className="text-3xl font-bold">{averageReading} mg/dL</p>
            </div>
            </div>
            <div className="mb-6 h-64">
              {/* <h2 className="text-2xl font-semibold mb-4">Blood Sugar Trend</h2> */}
              <Line data={data} options={options} />
            </div>
            
          </div>
          {latestReading > 140 && (
            <div className="bg-red-100  p-4 rounded-lg">
              <p>Warning: High Blood Sugar! Consider medication or a doctor's advice.</p>
            </div>
          )}
        </div>
      </div>

     <div className='flex flex-col gap-10 h-full'>
         {/* Effective Tablets and Allergies Section */}
      <div className=" bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-4">Effective Tablets & Allergies</h2>
       <div className='flex flex-col gap-10'>
       <div >
          <h3 className="text-xl font-semibold mb-2">Effective Tablets</h3>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-bold">Aspirin</span> - Pain relief, fever reduction
            </li>
            <li>
              <span className="font-bold">Metformin</span> - Blood sugar control
            </li>
            <li>
              <span className="font-bold">Lisinopril</span> - Blood pressure management
            </li>
          </ul>
        </div>
        
       </div>
       
      </div>
      <div className=" bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4">
          <h3 className="text-xl font-semibold mb-2">Allergies</h3>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-bold">Penicillin</span> - Rash, itching
            </li>
            <li>
              <span className="font-bold">Ibuprofen</span> - Stomach upset
            </li>
            <li>
              <span className="font-bold">Sulfa Drugs</span> - Nausea, diarrhea
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4">
  <h3 className="text-xl font-semibold mb-2">Surgery</h3>
  <ul className="list-disc pl-5">
    <li>
      <span className="font-bold">Appendectomy</span> - Removal of the appendix
    </li>
    <li>
      <span className="font-bold">Cholecystectomy</span> - Removal of the gallbladder
    </li>
    <li>
      <span className="font-bold">Hernia Repair</span> - Repair of a hernia
    </li>
  </ul>
</div>

     </div>
      </div>
    </div>
  );
};

export default MergedHealthDashboard;
