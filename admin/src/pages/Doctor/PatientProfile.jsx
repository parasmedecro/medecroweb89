// src/components/PatientProfile.js
import React, { useEffect, useState,useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify';

const PatientProfile = () => {
  const { id } = useParams();  // Get the patient ID from the URL
  const [patientData, setPatientData] = useState(null);
  const { backendUrl } = useContext(AppContext)
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(backendUrl +`/api/doctor/patient/${id}`,{ headers: { dToken } });  // Replace with actual API call
        console.log("HI")
        console.log(response)
        setPatientData(response.data);
      } catch (error) {
        toast.error('Failed to fetch patient data');
      }
    };
    fetchPatientData();
  }, [id]);

  return (
    <div className="w-full max-w-4xl m-auto p-5 bg-white shadow-md rounded-lg">
      {patientData ? (
        <div>
          <h1 className="text-xl font-bold mb-4">Patient Profile: {patientData.name}</h1>
          <p><strong>Age:</strong> {patientData.age}</p>
          <p><strong>Email:</strong> {patientData.email}</p>
          {/* Add more patient details here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PatientProfile;
