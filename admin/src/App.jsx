import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import PatientList from './pages/Doctor/PatientList';
// App.js or where routes are defined
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientProfile from './pages/Doctor/PatientProfile';  // Import the component
import PatientPrescription from './pages/Doctor/PatientPrescription';
import Report from './pages/Doctor/PatientReport';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  const sampleProps = {
    males: 120,
    females: 100,
    diseases: ['Flu', 'Cold', 'COVID-19', 'Allergy'],
    patientCounts: [50, 40, 60, 30],
    bloodGroups: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'],
    bloodGroupCounts: [30, 20, 25, 10, 5, 8, 3, 2],
    ageGroups: ['0-18', '19-35', '36-50', '51-65', '65+'],
    ageGroupCounts: [50, 80, 90, 60, 40],
    adverseDrugs: ['Drug A', 'Drug B', 'Drug C', 'Drug D'],
    drugCounts: [10, 20, 30, 15],
    dailyAppointments: [20, 30, 25, 35, 40, 30, 20],
    appointmentsCounts: [5, 7, 10, 12, 8, 5, 3]
  };

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard {...sampleProps} />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path="/patient/:id" element={<PatientProfile />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/prescription/:id" element={<PatientPrescription />} />
          <Route path="/report/:id" element={<Report />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App

