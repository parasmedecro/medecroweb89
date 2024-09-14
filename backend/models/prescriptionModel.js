import mongoose from "mongoose";

// Define the schema for a prescription
const prescriptionSchema = new mongoose.Schema({
  // Patient information
  patientId: { type: String, required: true },      // Patient ID
  patientName: { type: String, required: true },    // Patient name
  patientAge: { type: String, required: true },     // Patient age

  // Doctor information
  doctorId: { type: String, required: true },       // Doctor ID
  doctorName: { type: String, required: true },     // Doctor name
  doctorSpecialty: { type: String, required: true },// Doctor specialty

  // Prescription details (No nested schema)
  prescriptions: {
    type: { type: String, required: true },         // e.g., Tablet, Drop, Cream, Oil
    medicine: { type: String, required: true },     // e.g., Paracetamol
    slot: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      night: { type: Boolean, default: false }
    },
    beforeAfter: {
      before: { type: Boolean, default: false },
      after: { type: Boolean, default: false }
    },
    dose: { type: String, required: true },         // e.g., 1/2, 1
    days: { type: String, required: true }          // e.g., 7 days
  },

  // Advice and investigations
  advice: { type: [String], default: [] },          // Array of advice strings
  investigations: { type: [String], default: [] },  // Array of investigation instructions

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });  // Automatically handles createdAt and updatedAt

// Define the model for the prescription
const Prescription = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema);

export default Prescription;
