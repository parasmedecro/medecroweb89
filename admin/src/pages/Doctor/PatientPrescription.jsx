import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from "jspdf";
import PatientProfile from './PatientProfile';

const Prescription = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [userData, setPatientData] = useState({ name: '', dob: '', phone: '', address: '', gender: '' });
  const [userData1, setPatientData1] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const { dToken, profileData, getProfileData } = useContext(DoctorContext);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [id1, setid1] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [advice, setAdvice] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [symtom1, setsymtom1] = useState('')
  const [medtype1, setmedtype1] = useState('')
  const [medname1, setmename1] = useState('')
  const [activeForm, setActiveForm] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    symptoms: '',
    type: '',
    medicine: '',
    slot: { morning: false, afternoon: false, night: false },
    beforeAfter: { before: false, after: false },
    dose: '',
    days: '',
    advice: '',
    instruction: '',
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/doctor/patient/${id}`,
          { headers: { dToken } }
        ); // Replace with actual API call
        console.log(response)
        setPatientData1(response.data);
      } catch (error) {
        toast.error("Failed to fetch patient data");
      }
    };
    fetchPatientData();
  }, [id]);

  const medicines = {
    Tablet: [
      'Amitriptyline',       // Antidepressant
      'Paracetamol',         // Pain reliever, antipyretic
      'Omega 3',             // Supplement
      'Ibuprofen',           // Anti-inflammatory, pain relief
      'Metformin',           // Diabetes medication
      'Atorvastatin',        // Cholesterol control
      'Amlodipine',          // Blood pressure control
      'Losartan',            // Hypertension treatment
      'Levothyroxine',       // Thyroid hormone
      'Clopidogrel',         // Blood thinner
      'Esomeprazole',        // Acid reflux
      'Ciprofloxacin',       // Antibiotic
      'Alprazolam',          // Anxiety treatment
      'Prednisone',          // Anti-inflammatory steroid
      'Cetirizine',          // Allergy relief
      'Doxycycline',         // Antibiotic
      'Hydroxychloroquine',  // Malaria, rheumatoid arthritis treatment
      'Ranitidine',          // Heartburn relief
      'Montelukast',         // Asthma and allergies
      'Fluoxetine',          // Antidepressant
      'Gabapentin',          // Nerve pain, anticonvulsant
      'Sildenafil',          // Erectile dysfunction
      'Azithromycin',        // Antibiotic
    ],
    Drop: [
      'Eye Drop',            // General eye medication
      'Nasal Drop',          // Nasal congestion relief
      'Ear Drop',            // Ear infection treatment
      'Saline Nasal Drops',  // Nasal hydration
      'Tropicamide Eye Drop',// Eye dilation for exams
      'Oflaxacin Ear Drop',  // Antibiotic for ear infection
      'Timolol Eye Drops',   // Glaucoma treatment
      'Ciprofloxacin Ear Drops', // Ear infection treatment
      'Hydrocortisone Eye Drops', // Anti-inflammatory
    ],
    Cream: [
      'Antiseptic Cream',      // For wound care
      'Moisturizing Cream',    // Skin hydration
      'Hydrocortisone Cream',  // Anti-itch, anti-inflammatory
      'Clotrimazole Cream',    // Antifungal
      'Ketoconazole Cream',    // Antifungal
      'Mupirocin Cream',       // Antibiotic for skin infections
      'Betamethasone Cream',   // Corticosteroid for eczema, psoriasis
      'Benzoyl Peroxide Cream', // Acne treatment
      'Neomycin Cream',        // Antibiotic for minor skin infections
      'Retinoid Cream',        // Anti-aging, acne treatment
    ],
    Oil: [
      'Coconut Oil',           // Skin and hair moisturizer
      'Hair Oil',              // Hair nourishment
      'Olive Oil',             // Skin care, massage oil
      'Castor Oil',            // Hair and skin benefits
      'Eucalyptus Oil',        // Aromatherapy, pain relief
      'Tea Tree Oil',          // Antifungal, antibacterial
      'Lavender Oil',          // Relaxation, sleep aid
      'Peppermint Oil',        // Muscle relief, aromatherapy
      'Jojoba Oil',            // Skin and hair moisturizing
      'Sesame Oil',            // Ayurvedic treatments, massage
    ]
  };

  const diseaseMedicines = {
    "fever": { type: "Tablet", medicine: "Paracetamol" },
    "headache": { type: "Tablet", medicine: "Ibuprofen" },
    "runny nose": { type: "Drop", medicine: "Nasal Drop" },
    "cough": { type: "Syrup", medicine: "Cough Syrup" },
    "cold": { type: "Tablet", medicine: "Antihistamine" },
    "sore throat": { type: "Lozenge", medicine: "Throat Lozenges" },
    "muscle pain": { type: "Tablet", medicine: "Aspirin" },
    "joint pain": { type: "Cream", medicine: "Anti-inflammatory Cream" },
    "stomach ache": { type: "Tablet", medicine: "Antacid" },
    "indigestion": { type: "Tablet", medicine: "Digestive Aid" },
    "allergy": { type: "Tablet", medicine: "Antihistamine" },
    "skin rash": { type: "Cream", medicine: "Hydrocortisone Cream" },
    "acne": { type: "Cream", medicine: "Benzoyl Peroxide" },
    "dizziness": { type: "Tablet", medicine: "Anti-vertigo Tablet" },
    "nausea": { type: "Tablet", medicine: "Anti-nausea Tablet" },
    "vomiting": { type: "Tablet", medicine: "Anti-vomiting Tablet" },
    "constipation": { type: "Laxative", medicine: "Fiber Supplement" },
    "diarrhea": { type: "Tablet", medicine: "Anti-diarrheal Tablet" },
    "high blood pressure": { type: "Tablet", medicine: "ACE Inhibitor" },
    "diabetes": { type: "Tablet", medicine: "Metformin" },
    "insomnia": { type: "Tablet", medicine: "Sleep Aid" },
    "anxiety": { type: "Tablet", medicine: "Anti-anxiety Medication" },
    "depression": { type: "Tablet", medicine: "Antidepressant" },
    "asthma": { type: "Inhaler", medicine: "Bronchodilator" },
    "bronchitis": { type: "Syrup", medicine: "Expectorant Syrup" },
    "sinusitis": { type: "Drop", medicine: "Nasal Spray" },
    "ear infection": { type: "Drop", medicine: "Ear Drops" },
    "toothache": { type: "Gel", medicine: "Dental Gel" },
    "back pain": { type: "Cream", medicine: "Pain Relief Cream" },
    "ulcer": { type: "Tablet", medicine: "Antacid" },
    "heartburn": { type: "Tablet", medicine: "Proton Pump Inhibitor" },
    "chronic cough": { type: "Syrup", medicine: "Cough Suppressant Syrup" },
    "gout": { type: "Tablet", medicine: "Uric Acid Reducer" },
    "kidney stones": { type: "Tablet", medicine: "Pain Reliever" },
    "osteoporosis": { type: "Tablet", medicine: "Calcium Supplement" },
    "pneumonia": { type: "Antibiotic", medicine: "Pneumonia Antibiotic" },
    "herpes": { type: "Cream", medicine: "Antiviral Cream" },
    "psoriasis": { type: "Cream", medicine: "Topical Steroid" },
    "eczema": { type: "Cream", medicine: "Moisturizing Cream" },
    "menstrual cramps": { type: "Tablet", medicine: "Pain Reliever" },
    "UTI": { type: "Tablet", medicine: "Antibiotic" },
    "hypertension": { type: "Tablet", medicine: "Beta Blocker" },
    "hyperthyroidism": { type: "Tablet", medicine: "Antithyroid Drug" },
    "hypothyroidism": { type: "Tablet", medicine: "Thyroid Hormone Replacement" },
    "stroke": { type: "Tablet", medicine: "Antiplatelet" },
    "heart attack": { type: "Tablet", medicine: "Antiplatelet" },
    "allergic rhinitis": { type: "Tablet", medicine: "Antihistamine" },
    "chronic fatigue": { type: "Tablet", medicine: "Vitamin Supplement" }
  };



  useEffect(() => {
    setid1(id);
  }, [id]);

  const [getprescriptionsdb, setgetPrescriptionsdb] = useState([]);
  const [loading, setLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);      // For error handling

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);  // Set loading to true before starting the fetch
      setError(null);    // Clear any previous errors

      try {
        const response = await axios.get(`${backendUrl}/api/doctor/prescriptions/${id}`, { headers: { dToken } }); // Replace with your endpoint
        console.log("here is get - " + response.data)
        setgetPrescriptionsdb(response.data); // Set fetched data to state
      } catch (err) {
        // Catch errors and set the error message
        setError(err.response ? err.response.data.message : 'Error fetching data');
      } finally {
        // Ensure loading is set to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchPrescriptions();
    console.log(getprescriptionsdb)
  }, []);  // Empty dependency array means it runs only on component mount


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
  const handleInputChangesym = (value) => {
    setsymtom1(value);
    let type1 = diseaseMedicines[value]?.type;
    let medicine1 = diseaseMedicines[value]?.medicine
    console.log(type1, medicine1, value)
    setmedtype1(type1);
    setmename1(medicine1);
    setNewPrescription({ ...newPrescription, symptoms: value, type: type1, medicine: medicine1 })
  };
  const handleInputChangetype = (value) => {
    setmedtype1(value);
    setNewPrescription({ ...newPrescription, type: value })
  };
  const handleInputChangename = (value) => {
    setmename1(value);
    setNewPrescription({ ...newPrescription, medicine: value })
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
        symptoms: '',
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
    try {
      await axios.post(
        `${backendUrl}/api/doctor/prescriptions`,
        {
          patientId: id,
          patientName: userData.name,
          patientAge: calculateAge(userData.dob),
          doctorId: profileData._id,
          doctorName: profileData.name,
          doctorSpecialty: profileData.degree,
          prescriptions,
          advice,
          investigations,
        },
        {
          headers: { dToken },
        }
      );
      toast.success('Prescription saved successfully');

      // Clear all data after saving
      setPrescriptions([]);
      setAdvice([]);
      setInvestigations([]);
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
    }


  };

  // Function to download the content as a PDF
  const handleDownloadPDF = (prescription) => {
    const doc = new jsPDF();

    // Adding content to the PDF (prescription example)
    doc.text(`Prescription for ${prescription.patientName}`, 10, 10);
    doc.text(`Age: ${prescription.patientAge}`, 10, 20);
    doc.text(
      `Doctor: ${prescription.doctorName} (${prescription.doctorSpecialty})`,
      10,
      30
    );

    doc.text("Details:", 10, 40);
    prescription.prescriptionDetails.forEach((detail, index) => {
      const yOffset = 30; // Ensure enough space between entries
      const startY = 60 + index * yOffset; // Calculate Y dynamically based on index and offset

      doc.text(`Medicine ${index + 1}: ${detail.medicine}`, 10, startY);
      doc.text(`- Dose: ${detail.dose}`, 10, startY + 10); // Move down by 10 units
      doc.text(`- Days: ${detail.days}`, 10, startY + 20); // Move down by another 10 units
    });

    // Saving the PDF
    doc.save(`${prescription.patientName}_prescription.pdf`);
  };

  // Function to format the prescription details for sharing
  const escapeMarkdownV2 = (text) => {
    if (!text) return ""; // Handle null or undefined text
    return text
      .replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1') // Escape special Markdown characters
      .replace(/\\/g, '\\\\') // Escape backslashes
      .replace(/\n/g, '\\n'); // Handle newlines
  };
  
  
  const formatPrescriptionText = (prescription) => {
    if (!prescription) return "No prescription data available";
  
    const {
      patientName = "Unknown Patient",
      patientAge = "Unknown Age",
      doctorName = "Unknown Doctor",
      doctorSpecialty = "Unknown Specialty",
      prescriptionDetails = [],
      advice = [],
      investigations = []
    } = prescription;
  
    return `
    *Prescription for ${escapeMarkdownV2(patientName)} \\(Age: ${escapeMarkdownV2(patientAge)}\\)*
    *Doctor:* ${escapeMarkdownV2(doctorName)} \\(${escapeMarkdownV2(doctorSpecialty)}\\)
    
    *Details:*
    ${prescriptionDetails
      .map(
        (detail) => `
      \\- *Medicine:* ${escapeMarkdownV2(detail.medicine || "Unknown")}
      \\- *Dose:* ${escapeMarkdownV2(detail.dose || "Unknown")}
      \\- *Days:* ${escapeMarkdownV2(detail.days || "Unknown")}
      \\- *Slot:* ${detail.slot?.morning ? "Morning " : ""}${detail.slot?.afternoon ? "Afternoon " : ""}${detail.slot?.night ? "Night" : ""}
      \\- *Before/After:* ${detail.beforeAfter?.before ? "Before " : ""}${detail.beforeAfter?.after ? "After" : ""}
      `
      )
      .join("")}
    
    *Advice:* ${advice.length > 0
      ? escapeMarkdownV2(advice.join(", "))
      : "No advice"
    }
    
    *Investigations:* ${investigations.length > 0
      ? escapeMarkdownV2(investigations.join(", "))
      : "No investigations"
    }`;
  };
  
  

  // Function to share via Telegram
  const handleShareTelegram = async (prescription) => {
    let uname = userData1.name
    let uchat = userData1.chatid
    console.log(uname,uchat,prescription)
    const text = formatPrescriptionText(prescription);
    await axios.post(backendUrl+'/api/telegram/sendtelprescription',{uname,uchat,text})
  };


  return (
    <div className='flex flex-col'>
      <div className="flex flex-col w-full max-w-7xl mx-auto p-6 font-sans">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">ID:</label>
            <input type="text" value={id1} className="border border-gray-300 rounded p-2" />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Name:</label>
            <input type="text" value={userData.name} className="border border-gray-300 rounded p-2" />
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
                    <label className="text-gray-700 font-medium">Symptoms:</label>
                    <select
                      className="border border-gray-300 rounded p-2 w-full"
                      value={symtom1}
                      onChange={(e) => handleInputChangesym(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {Object.keys(diseaseMedicines).map((symptoms, index) => (
                        <option key={index} value={symptoms}>
                          {symptoms}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-700 font-medium">Medicine Type:</label>
                    <select
                      className="border border-gray-300 rounded p-2 w-full"
                      value={medtype1}
                      // value={symtom1 ? diseaseMedicines[symtom1].type : newPrescription.type}
                      onChange={(e) => handleInputChangetype(e.target.value)}
                    // onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {diseaseMedicines[symtom1] && (
                        <option value={diseaseMedicines[symtom1].type}>
                          {diseaseMedicines[symtom1].type}
                        </option>

                      )}
                      {/* <option value="">Select Type</option> */}
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
                      value={medname1}
                      // value={symtom1 ? diseaseMedicines[symtom1]?.medicine : newPrescription.medicine}
                      onChange={(e) => handleInputChangename(e.target.value)}
                    // onChange={(e) => handleInputChange('medicine', e.target.value)}
                    >
                      <option value="">Select Medicine</option>
                      {diseaseMedicines[symtom1] && (
                        <option value={diseaseMedicines[symtom1].medicine}>
                          {diseaseMedicines[symtom1].medicine}
                        </option>
                      )}
                      {/* <option value="">Select Medicine</option> */}
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

      {/* BELOW CODE SEE TO MODIFY */}

      {/* <div className="container mx-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>  // If loading is true, display loading message
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>  // If error exists, display error message
        ) : !Array.isArray(getprescriptionsdb) || getprescriptionsdb.length === 0 ? (
          <p className="text-center text-gray-500">No prescriptions available</p>  // If getprescriptionsdb is not an array or it's empty
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getprescriptionsdb.map((prescription) => (
              <div key={prescription._id} className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-2">Patient: {prescription.patientName}</h2>
                <p className="text-sm text-gray-700">Age: {prescription.patientAge}</p>
                <p className="text-sm text-gray-700">Doctor: {prescription.doctorName} ({prescription.doctorSpecialty})</p>

                <h3 className="text-lg font-semibold mt-4">Symptom:</h3>
                <ul className="list-disc pl-5">
                  <li className='mt-2'>
                    {prescription.prescriptionDetails?.map((detail, index) => (
                      <li key={index} className="mt-2">
                        <p><span className="font-semibold">Symptom:</span> {detail.symptoms}</p>
                      </li>
                    ))}
                  </li>

                </ul>
                <h3 className="text-lg font-semibold mt-4">Details:</h3>
                <ul className="list-disc pl-5">
                  {prescription.prescriptionDetails?.map((detail, index) => (
                    <li key={index} className="mt-2">
                      <p><span className="font-semibold">Type:</span> {detail.type}</p>

                      <p><span className="font-semibold">Medicine:</span> {detail.medicine}</p>
                      <p>
                        <span className="font-semibold">Slot:</span>
                        {detail.slot?.morning ? ' Morning ' : ''}
                        {detail.slot?.afternoon ? ' Afternoon ' : ''}
                        {detail.slot?.night ? ' Night' : ''}
                      </p>
                      <p>
                        <span className="font-semibold">Before/After:</span>
                        {detail.beforeAfter?.before ? ' Before ' : ''}
                        {detail.beforeAfter?.after ? ' After' : ''}
                      </p>
                      <p><span className="font-semibold">Dose:</span> {detail.dose}</p>
                      <p><span className="font-semibold">Days:</span> {detail.days}</p>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mt-4">Advice:</h3>
                {prescription.advice.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {prescription.advice.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-500">No advice</p>}

                <h3 className="text-lg font-semibold mt-4">Investigations:</h3>
                {prescription.investigations.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {prescription.investigations.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-500">No investigations</p>}
              </div>
            ))}
          </div>
        )}
      </div> */}

      <div className="container w-full mx-auto p-4 bg-red-200">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p> // If loading is true, display loading message
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p> // If error exists, display error message
        ) : !Array.isArray(getprescriptionsdb) ||
          getprescriptionsdb.length === 0 ? (
          <p className="text-center text-gray-500">
            No prescriptions available
          </p> // If getprescriptionsdb is not an array or it's empty
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getprescriptionsdb.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white shadow-md rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Patient Name: {prescription.patientName}
                </h2>
                <p className="text-sm text-gray-700">
                  Age: {prescription.patientAge}
                </p>
                <p className="text-sm text-gray-700">
                  Doctor: {prescription.doctorName} (
                  {prescription.doctorSpecialty})
                </p>

                <h3 className="text-lg font-semibold mt-4">Details:</h3>
                <ul className="list-disc pl-5">
                  {prescription.prescriptionDetails?.map((detail, index) => (
                    <li key={index} className="mt-2">
                      <p>
                        <span className="font-semibold">Type:</span>{" "}
                        {detail.type}
                      </p>
                      <p>
                        <span className="font-semibold">Medicine:</span>{" "}
                        {detail.medicine}
                      </p>
                      <p>
                        <span className="font-semibold">Slot:</span>
                        {detail.slot?.morning ? " Morning " : ""}
                        {detail.slot?.afternoon ? " Afternoon " : ""}
                        {detail.slot?.night ? " Night" : ""}
                      </p>
                      <p>
                        <span className="font-semibold">Before/After:</span>
                        {detail.beforeAfter?.before ? " Before " : ""}
                        {detail.beforeAfter?.after ? " After" : ""}
                      </p>
                      <p>
                        <span className="font-semibold">Dose:</span>{" "}
                        {detail.dose}
                      </p>
                      <p>
                        <span className="font-semibold">Days:</span>{" "}
                        {detail.days}
                      </p>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mt-4">Advice:</h3>
                {prescription.advice.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {prescription.advice.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No advice</p>
                )}

                <h3 className="text-lg font-semibold mt-4">
                  Investigations:
                </h3>
                {prescription.investigations.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {prescription.investigations.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No investigations</p>
                )}

                {/* Print and Download Buttons */}
                <div className="mt-4 flex space-x-4">
                  {/* <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePrint}
          >
            Print
          </button> */}
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDownloadPDF(prescription)}
                  >
                    Download as PDF
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleShareTelegram(prescription)}
                  >
                    Share on Telegram
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescription;
