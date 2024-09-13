import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PatientList = () => {
    const [patientData, setPatientData] = useState([]);
    const { backendUrl } = useContext(AppContext);
    const { dToken } = useContext(DoctorContext);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/doctor/patients`, { headers: { dToken } });
                if (response.data.success) {
                    setPatientData(response.data.patients);
                } else {
                    toast.error('Failed to fetch patient data');
                }
            } catch (error) {
                toast.error('Failed to fetch patient data');
            }
        };
        fetchPatientData();
    }, [backendUrl, dToken]);

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="mb-3 text-lg font-medium">All Patients</p>
            <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
                <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] gap-1 py-3 px-6 border-b bg-gray-200 text-gray-700 font-medium">
                    <p>No</p>
                    <p>Patient</p>
                    <p>Phone</p>
                    <p>Address</p>
                    <p>Date of Birth</p>
                    <p>Gender</p>
                </div>
                {patientData.length > 0 ? (
                    patientData.map((patient, index) => (
                        <div
                            key={patient._id}
                            className="grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] gap-1 py-3 px-6 border-b hover:bg-gray-50"
                        >
                            <p className="text-xs">{index + 1}</p>
                            <div className="flex items-center gap-2">
                                <img src={patient.image} className="w-8 h-8 rounded-full" alt={patient.name} />
                                <Link to={`/patient/${patient._id}`} className="text-blue-500 underline">
                                    {patient.name}
                                </Link>
                            </div>
                            <p className="text-xs">{patient.phone}</p>
                            <p className="text-xs">{patient.address.line1} {patient.address.line2}</p>
                            <p className="text-xs">{new Date(patient.dob).toLocaleDateString()}</p>
                            <p className="text-xs">{patient.gender}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-3">No patients found</p>
                )}
            </div>
        </div>
    );
};

export default PatientList;
