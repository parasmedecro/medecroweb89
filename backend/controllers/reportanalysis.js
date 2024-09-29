import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import userModel from "../models/userModel.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to extract JSON from markdown-formatted string
function extractJSONFromMarkdown(text) {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (error) {
      // console.error('Failed to parse extracted JSON:', error);
      return null;
    }
  }
  return null;
}
const addCustomField = async (req, res) => {
  const { key } = req.body;
  // console.log(req.body)
  const field = key.key;
  const value = key.value;
  const patientId = req.params.id;
  const patient = await userModel.findById(patientId);
  if (!patient) {
    // console.log('No patient found with this ID');
    return res.status(404).json({ message: "Patient not found" });
  }

  // Check if custom_data field exists; if not, initialize it
  if (!patient.custom_data) {
    patient.custom_data = {}; // Initialize custom_data as an empty object
    await patient.save(); // Save the patient to update the document
  }

  try {
    // console.log('Update Query:', { _id: patientId }, { $set: { [`custom_data.${field}`]: value } });

    const data = await userModel.updateOne(
      { _id: patientId },
      { $set: { [`custom_data.${field}`]: value } }
    );
    // console.log(data)
    if (data.acknowledged && data.modifiedCount > 0) {
      // console.log('Custom field added successfully');
      res.status(200).json({ message: "Custom field added successfully" });
    } else {
      // console.log('No document found or modified');
      res
        .status(404)
        .json({ message: "No patient found or no modification done" });
    }
  } catch (error) {
    // console.error('Error in adding new field:', error);
    res
      .status(500)
      .json({ message: "Error in adding new field", error: error.message });
  }
};

const processParsedResults = (parsedResults) => {
  let formattedResults = {};

  // Loop through each key-value pair in the parsed results
  for (const [key, value] of Object.entries(parsedResults)) {
    // Convert each value to a string, regardless of its type
    formattedResults[key] = String(value);
  }

  return formattedResults;
};

const analysisreport = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;

  // Read the file
  const fileBuffer = fs.readFileSync(filePath);

  try {
    // Fetch the patient's existing data
    const patientId = req.params.id;
    const patient = await userModel.findById(patientId);

    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    const existingCustomData = patient.custom_data || {
      msg: "Patient not have previous any data.",
    };

    // Prepare the prompt with existing data
    let prompt = `
    Scan all the data given in the photo.
    The existing medical data of the patient is: ${JSON.stringify(
      existingCustomData
    )}. 
    Check if any of the new data in the report matches the existing data.
    If it matches, use the same key as the existing data.
    If the new data is not present in the existing data, assign a new key-value pair for it.
    If a value has a unit (e.g., mg/dL, bpm), include the unit in the value string.
    Return the important data as a flat JSON object with key-value pairs (no nested objects).
  `;

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    // Generate content with the AI model
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    // console.log(text)
    // Extract and parse JSON from the response
    const parsedResults = extractJSONFromMarkdown(text);
    // console.log("\nformatted - "+parsedResults+"\n")
    if (parsedResults) {
      // Process the parsed results to ensure proper key-value formatting
      const formattedResults = processParsedResults(parsedResults);
      // console.log("formatted - "+formattedResults)
      res.json(formattedResults);
    } else {
      res.status(500).send("Failed to parse the API response");
    }
  } catch (error) {
    // console.error('Error processing file with Gemini API:', error);
    res.status(500).send("Error processing file: " + error.message);
  } finally {
    // Clean up: delete the uploaded file
    fs.unlinkSync(filePath);
  }
};

export { addCustomField };
export default analysisreport;
