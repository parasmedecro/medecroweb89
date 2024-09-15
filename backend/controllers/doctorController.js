import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import Prescription from "../models/prescriptionModel.js";
import { v2 as cloudinary } from "cloudinary";

// API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { number, password } = req.body;
    const user = await doctorModel.findOne({ number });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    }

    res.json({ success: false, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    }

    res.json({ success: false, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// API to get all patients list for Frontend
const patientList = async (req, res) => {
  try {
    const patients = await userModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, patients });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    console.log("hi");
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const PatientProfile = async (req, res) => {
  const patientId = req.params.id;
  try {
    const patient = await userModel.findById(patientId); // Replace with actual data source
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient data" });
  }
};

const savePrescription = async (req, res) => {
    console.log("here");
  
    try {
      const { patientId, patientName, patientAge, doctorId, doctorName, doctorSpecialty, prescriptions, advice, investigations } = req.body;
  
      // Ensure prescriptions is an array and not empty
      if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
        return res.status(400).json({ message: "Prescriptions array is required and cannot be empty" });
      }
      // console.log(symptoms)
  
      const filteredPrescriptions = prescriptions.map(prescription => ({
        symptoms:prescription.symptoms,
        type: prescription.type,
        medicine: prescription.medicine,
        slot: prescription.slot,
        beforeAfter: prescription.beforeAfter,
        dose: prescription.dose,
        days: prescription.days
      }));

      const newPrescription = new Prescription({
        patientId,
        patientName,
        patientAge,
        doctorId,
        doctorName,
        doctorSpecialty,
        prescriptionDetails: filteredPrescriptions,  // Save the filtered array of prescriptions
        advice: advice || [],  // Use provided advice or an empty array
        investigations: investigations || []  // Use provided investigations or an empty array
      });
  
      await newPrescription.save();
  
      res.status(201).json({ message: "Prescription saved successfully" });
    } catch (error) {
      console.error('Error saving prescriptions:', error);
      res.status(500).json({ message: "Failed to save prescriptions", error: error.message });
    }
  };


  const getSavedPrescriptions = async (req, res) => {
    const patientId = req.params.id; // Extract patientId from the request parameters
  
    try {
      // Fetch all prescriptions for the specific patient using the patientId
      const prescriptions = await Prescription.find({ patientId });
  
      // If no prescriptions are found, return a 404 response
      if (!prescriptions || prescriptions.length === 0) {
        return res.status(404).json({ message: "No prescriptions found for this patient" });
      }
  
      // Send back the prescriptions in JSON format
      res.json(prescriptions);
    } catch (error) {
      // Handle any errors that occur during fetching
      res.status(500).json({ message: "Error fetching prescriptions", error: error.message });
    }
  };
  const analysisreport = async (req, res) => {
    const patientId = req.params.id; // Extract patientId from the request parameters
  
    try {
      // Fetch all prescriptions for the specific patient using the patientId
      const prescriptions = await Prescription.find({ patientId });
  
      // If no prescriptions are found, return a 404 response
      if (!prescriptions || prescriptions.length === 0) {
        return res.status(404).json({ message: "No prescriptions found for this patient" });
      }
  
      // Send back the prescriptions in JSON format
      res.json(prescriptions);
    } catch (error) {
      // Handle any errors that occur during fetching
      res.status(500).json({ message: "Error fetching prescriptions", error: error.message });
    }
  };

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  PatientProfile,
  getProfile,
  updateProfile,
  patientList,
  savePrescription,
  getSavedPrescriptions,
  analysisreport
};
