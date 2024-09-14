import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Prescription = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [userData, setPatientData] = useState({ name: '', dob: '', phone: '', address: '', gender: '' });

  const { backendUrl } = useContext(AppContext);
  const { dToken ,profileData, getProfileData} = useContext(DoctorContext);

  const [id1, setid1] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [advice, setAdvice] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    type: '',
    medicine: '',
    slot: { morning: false, afternoon: false, night: false },
    beforeAfter: { before: false, after: false },
    dose: '',
    days: '',
    advice: '',
    instruction: '',
  });

  const medicines = {
    Tablet: ['Amitriptyline', 'Paracetamol', 'Omega 3'],
    Drop: ['Eye Drop', 'Nasal Drop'],
    Cream: ['Antiseptic Cream', 'Moisturizing Cream'],
    Oil: ['Coconut Oil', 'Hair Oil'],
  };

  useEffect(() => {
    setid1(id);
  }, [id]);

  useEffect(() => {
    if (dToken) {
        getProfileData()
    }
}, [dToken])

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/doctor/patient/${id}`, {
          headers: { dToken },
        });

        if (response.data) {
          setPatient(response.data);
          setPatientData({
            name: response.data.name || '',
            dob: response.data.dob || '',
            phone: response.data.phone || '',
            address: response.data.address || '',
            gender: response.data.gender || '',
          });
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, [id, backendUrl, dToken]);

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (field, value) => {
    setNewPrescription({ ...newPrescription, [field]: value });
  };

  const handleSlotChange = (slot) => {
    setNewPrescription((prev) => ({
      ...prev,
      slot: { ...prev.slot, [slot]: !prev.slot[slot] },
    }));
  };

  const handleBeforeAfterChange = (mealTime) => {
    setNewPrescription((prev) => ({
      ...prev,
      beforeAfter: { before: mealTime === 'before', after: mealTime === 'after' },
    }));
  };

  const deletePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const deleteAdvice = (index) => {
    setAdvice(advice.filter((_, i) => i !== index));
  };

  const deleteInvestigation = (index) => {
    setInvestigations(investigations.filter((_, i) => i !== index));
  };


  const handleAdviceSave = () => {
    if (newPrescription.advice) {
      setAdvice([...advice, newPrescription.advice]);
      setNewPrescription({ ...newPrescription, advice: '' });
      setActiveForm(null);
    }
  };

  const handleInvestigationSave = () => {
    if (newPrescription.instruction) {
      setInvestigations([...investigations, newPrescription.instruction]);
      setNewPrescription({ ...newPrescription, instruction: '' });
      setActiveForm(null);
    }
  };

  const addNewPrescription = async () => {
    if (
      newPrescription.type &&
      newPrescription.medicine &&
      (newPrescription.slot.morning || newPrescription.slot.afternoon || newPrescription.slot.night) &&
      (newPrescription.beforeAfter.before || newPrescription.beforeAfter.after) &&
      newPrescription.dose &&
      newPrescription.days
    ) {
      const updatedPrescription = [...prescriptions, newPrescription];
      setPrescriptions(updatedPrescription);

      // Add new advice and investigation to their respective states
      if (newPrescription.advice) setAdvice([...advice, newPrescription.advice]);
      if (newPrescription.instruction) setInvestigations([...investigations, newPrescription.instruction]);

      // Reset the form
      setNewPrescription({
        type: '',
        medicine: '',
        slot: { morning: false, afternoon: false, night: false },
        beforeAfter: { before: false, after: false },
        dose: '',
        days: '',
        advice: '',
        instruction: '',
      });

    }
  };

  const saveAllData = async () => {
    console.log(prescriptions)
    try {
      await axios.post(
        `${backendUrl}/api/doctor/prescriptions`,
        {
          patientId: id,
          patientName:userData.name,
          patientAge:calculateAge(userData.dob),
          doctorId:profileData._id,
          doctorName:profileData.name,
          doctorSpecialty:profileData.degree,
          prescriptions,
          advice,
          investigations,
        },
        {
          headers: { dToken },
        }
      );
      alert('Prescription saved successfully');

      // Clear all data after saving
      setPrescriptions([]);
      setAdvice([]);
      setInvestigations([]);
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto p-6 font-sans">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">ID:</label>
          <input type="text" value={id1} className="border border-gray-300 rounded p-2" readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Name:</label>
          <input type="text" value={userData.name} className="border border-gray-300 rounded p-2" readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Age:</label>
          <input type="text" value={calculateAge(userData.dob)} className="border border-gray-300 rounded p-2" />
        </div>
      </div>

      <div className="flex gap-10">
        {/* Display Saved Prescriptions, Advice, and Investigations */}
        <div className="flex flex-col gap-4 mb-6 w-1/2">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Saved Prescriptions</h3>
            {prescriptions.length === 0 ? (
              <p>No prescriptions added yet.</p>
            ) : (
              prescriptions.map((item, index) => (
                <div key={index} className="border p-3 mb-2 rounded bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.medicine}</p>
                    <p>Dose: {item.dose}</p>
                    <p>Days: {item.days}</p>
                  </div>
                  <button className="text-red-500" onClick={() => deletePrescription(index)}>
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Advice</h3>
            {advice.length === 0 ? (
              <p>No advice added yet.</p>
            ) : (
              advice.map((item, index) => (
                <div key={index} className="border-b py-2 flex justify-between">
                  <p>{item}</p>
                  <button className="text-red-500" onClick={() => deleteAdvice(index)}>
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Investigations</h3>
            {investigations.length === 0 ? (
              <p>No investigations added yet.</p>
            ) : (
              investigations.map((item, index) => (
                <div key={index} className="border-b py-2 flex justify-between">
                  <p>{item}</p>
                  <button className="text-red-500" onClick={() => deleteInvestigation(index)}>
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Save All Data Button */}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            onClick={saveAllData}
            disabled={prescriptions.length === 0 && advice.length === 0 && investigations.length === 0}
          >
            Save Prescription
          </button>
        </div>

        {/* Buttons to Add Medicine, Advice, Investigation */}
        <div className="flex flex-col gap-4 mb-6 w-1/2">
          <div className="bg-white p-4 shadow rounded">
            <button
              className={`py-2 px-4 rounded w-full ${activeForm === 'medicine' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveForm('medicine')}
            >
              Add Medicine
            </button>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <button
              className={`py-2 px-4 rounded w-full ${activeForm === 'advice' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveForm('advice')}
            >
              Add Advice
            </button>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <button
              className={`py-2 px-4 rounded w-full ${activeForm === 'investigation' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveForm('investigation')}
            >
              Add Investigation
            </button>
          </div>

          {/* Form to Add Prescriptions */}
          {activeForm === 'medicine' && (
            <div className="bg-white p-6 shadow rounded w-full mt-4">
              <h3 className="text-lg font-semibold mb-4">Add Medicine</h3>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-gray-700 font-medium">Medicine Type:</label>
                  <select
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newPrescription.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {Object.keys(medicines).map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Medicine Name:</label>
                  <select
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newPrescription.medicine}
                    onChange={(e) => handleInputChange('medicine', e.target.value)}
                  >
                    <option value="">Select Medicine</option>
                    {medicines[newPrescription.type]?.map((med, index) => (
                      <option key={index} value={med}>
                        {med}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Dose:</label>
                  <input
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newPrescription.dose}
                    onChange={(e) => handleInputChange('dose', e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Days:</label>
                  <input
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newPrescription.days}
                    onChange={(e) => handleInputChange('days', e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-medium">Slots:</label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={newPrescription.slot.morning}
                        onChange={() => handleSlotChange('morning')}
                      />
                      <label>Morning</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={newPrescription.slot.afternoon}
                        onChange={() => handleSlotChange('afternoon')}
                      />
                      <label>Afternoon</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={newPrescription.slot.night}
                        onChange={() => handleSlotChange('night')}
                      />
                      <label>Night</label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-medium">Before/After Meal:</label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="beforeAfter"
                        className="mr-2"
                        checked={newPrescription.beforeAfter.before}
                        onChange={() => handleBeforeAfterChange('before')}
                      />
                      <label>Before Meals</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="beforeAfter"
                        className="mr-2"
                        checked={newPrescription.beforeAfter.after}
                        onChange={() => handleBeforeAfterChange('after')}
                      />
                      <label>After Meals</label>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="bg-green-500 text-white rounded py-2 px-4"
                  onClick={addNewPrescription}
                >
                  Add Medicine
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-black rounded py-2 px-4 mt-2"
                  onClick={() => setActiveForm(null)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Form to Add Advice */}
          {activeForm === 'advice' && (
            <div className="bg-white p-6 shadow rounded w-full mt-4">
              <h3 className="text-lg font-semibold mb-4">Add Advice</h3>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-gray-700 font-medium">Advice:</label>
                  <textarea
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newPrescription.advice}
                    onChange={(e) => handleInputChange('advice', e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="bg-green-500 text-white rounded py-2 px-4"
                  onClick={handleAdviceSave}
                >
                  Add Advice
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-black rounded py-2 px-4 mt-2"
                  onClick={() => setActiveForm(null)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Form to Add Investigations */}
          {activeForm === 'investigation' && (
            <div className="bg-white p-6 shadow rounded w-full mt-4">
              <h3 className="text-lg font-semibold mb-4">Add Investigation</h3>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-gray-700 font-medium">Investigation:</label>
                  <textarea
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newPrescription.instruction}
                    onChange={(e) => handleInputChange('instruction', e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="bg-green-500 text-white rounded py-2 px-4"
                  onClick={handleInvestigationSave}
                >
                  Add Investigation
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-black rounded py-2 px-4 mt-2"
                  onClick={() => setActiveForm(null)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescription;
