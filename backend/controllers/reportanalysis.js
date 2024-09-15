
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Function to extract JSON from markdown-formatted string
function extractJSONFromMarkdown(text) {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (error) {
      console.error('Failed to parse extracted JSON:', error);
      return null;
    }
  }
  return null;
}

const analysisreport = async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
  
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
  
    // Prepare the prompt
    let prompt = "Scan all the data given in the photo. I want the important data in JSON format. Nothing else.";
  
    try {
      // Initialize the model
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      // Prepare the image part
      const imagePart = {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: req.file.mimetype
        }
      };
  
      // Generate content
      const result = await model.generateContent([prompt, imagePart]);
      const text = await result.response.text(); // `await` added here
  
      // Extract and parse JSON from the response
      const parsedResults = extractJSONFromMarkdown(text);
      console.log(parsedResults);
  
      if (parsedResults) {
        res.json(parsedResults);
      } else {
        res.status(500).send('Failed to parse the API response');
      }
    } catch (error) {
      console.error('Error processing file with Gemini API:', error);
      res.status(500).send('Error processing file: ' + error.message);
    } finally {
      // Clean up: delete the uploaded file
      fs.unlinkSync(filePath);
    }
  };
  

export default analysisreport