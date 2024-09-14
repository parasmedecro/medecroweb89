import mongoose from "mongoose";

// Define the schema for a prescription
const prescriptionSchema = new mongoose.Schema({
  // Patient information
  patientId: { type: String},      // Patient ID
  patientName: { type: String  },    // Patient name
  patientAge: { type: String  },     // Patient age

  // Doctor information
  doctorId: { type: String  },       // Doctor ID
  doctorName: { type: String  },     // Doctor name
  doctorSpecialty: { type: String  },// Doctor specialty

  // Prescription details (Array of prescription objects)
  prescriptionDetails: [{
    type: { type: String  },         // e.g., Tablet, Drop, Cream, Oil
    medicine: { type: String  },     // e.g., Paracetamol
    slot: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      night: { type: Boolean, default: false }
    },
    beforeAfter: {
      before: { type: Boolean, default: false },
      after: { type: Boolean, default: false }
    },
    dose: { type: String  },         // e.g., 1/2, 1
    days: { type: String  }          // e.g., 7 days
  }],

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
