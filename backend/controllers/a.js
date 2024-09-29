
async function addCustomField(patientId, newField, value) {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db('medicalDB');
    const patients = database.collection('patients');

    // Add a new custom field
    const result = await patients.updateOne(
      { _id: patientId }, // Query to find the document by patient ID
      { $set: { [`custom_data.${newField}`]: value } } // Dynamically add a key-value pair
    );

    console.log(`Modified document count: ${result.modifiedCount}`);
  } finally {
    await client.close();
  }
}

addCustomField('patient_id_here', 'cholesterol_level', { hdl: 50, ldl: 120, total: 170 });
