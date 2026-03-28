const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/analyze', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Step 1: OCR - Extract text from image
    const imagePath = req.file.path;
    const { data: { text: extractedText } } = await Tesseract.recognize(imagePath, 'eng');

    if (!extractedText || extractedText.trim().length < 10) {
      // If OCR fails, use the image directly with Gemini Vision
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');
      const mimeType = req.file.mimetype;

      const result = await model.generateContent([
        {
          inlineData: { data: base64Image, mimeType }
        },
        `You are a medical report analyzer. Analyze this medical report image and provide a detailed response in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{
  "diagnosis": "Brief summary of the diagnosis or findings",
  "medicines": [
    { "name": "Medicine name", "dosage": "Dosage info", "frequency": "How often", "duration": "How long" }
  ],
  "treatment": [
    "Treatment step 1",
    "Treatment step 2"
  ],
  "diet": [
    { "food": "Food item", "benefit": "Why it helps", "amount": "Recommended amount" }
  ],
  "precautions": [
    "Precaution 1",
    "Precaution 2"
  ],
  "followUp": "When to follow up with doctor"
}`
      ]);

      const responseText = result.response.text();
      let parsed;
      try {
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleanJson);
      } catch {
        parsed = { rawAnalysis: responseText };
      }

      // Clean up uploaded file
      fs.unlinkSync(imagePath);
      return res.json({ success: true, analysis: parsed, method: 'vision' });
    }

    // Step 2: Send extracted text to Gemini for analysis
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a medical report analyzer. Here is the extracted text from a medical report:

"${extractedText}"

Analyze this medical report and provide a detailed response in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{
  "diagnosis": "Brief summary of the diagnosis or findings",
  "medicines": [
    { "name": "Medicine name", "dosage": "Dosage info", "frequency": "How often", "duration": "How long" }
  ],
  "treatment": [
    "Treatment step 1",
    "Treatment step 2"
  ],
  "diet": [
    { "food": "Food item", "benefit": "Why it helps", "amount": "Recommended amount" }
  ],
  "precautions": [
    "Precaution 1",
    "Precaution 2"
  ],
  "followUp": "When to follow up with doctor"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let parsed;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = { rawAnalysis: responseText };
    }

    // Clean up
    fs.unlinkSync(imagePath);
    res.json({ success: true, analysis: parsed, extractedText, method: 'ocr' });
  } catch (err) {
    console.error('Report analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze report: ' + err.message });
  }
});

module.exports = router;
