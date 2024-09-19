import mongoose from 'mongoose'

const medicineReminderSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  response: {
    type: String,
    enum: ['yes', 'no']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  remindedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a Mongoose model
const MedicineReminder = mongoose.model('MedicineReminder', medicineReminderSchema);

export default MedicineReminder;
