const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
  try {
    const { age, gender, height, weight, waist, bloodPressureSystolic, bloodPressureDiastolic, smokingStatus, exerciseFrequency, familyHistory, diet, sleepHours, stressLevel, alcoholConsumption } = req.body;

    if (!age || !gender || !height || !weight) {
      return res.status(400).json({ error: 'Age, gender, height, and weight are required' });
    }

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    const waistToHeightRatio = waist ? (waist / height).toFixed(2) : 'N/A';

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a health risk assessment AI. Based on the following health metrics, predict potential health risks and provide preventive recommendations.

PATIENT METRICS:
- Age: ${age} years
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- BMI: ${bmi}
- Waist Circumference: ${waist || 'Not provided'} cm
- Waist-to-Height Ratio: ${waistToHeightRatio}
- Blood Pressure: ${bloodPressureSystolic || 'N/A'}/${bloodPressureDiastolic || 'N/A'} mmHg
- Smoking Status: ${smokingStatus || 'Not provided'}
- Exercise Frequency: ${exerciseFrequency || 'Not provided'}
- Family History: ${familyHistory || 'Not provided'}
- Diet Type: ${diet || 'Not provided'}
- Sleep Hours: ${sleepHours || 'Not provided'} hours/night
- Stress Level: ${stressLevel || 'Not provided'}
- Alcohol Consumption: ${alcoholConsumption || 'Not provided'}

Provide response in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{
  "bmi": ${bmi},
  "bmiCategory": "Underweight/Normal/Overweight/Obese",
  "waistToHeightRatio": "${waistToHeightRatio}",
  "overallRiskLevel": "Low/Moderate/High/Very High",
  "risks": [
    {
      "disease": "Disease name",
      "riskLevel": "Low/Moderate/High",
      "probability": "percentage as string",
      "factors": ["Contributing factor 1", "Contributing factor 2"],
      "prevention": ["Prevention tip 1", "Prevention tip 2"]
    }
  ],
  "recommendations": {
    "diet": ["Dietary recommendation 1", "Dietary recommendation 2"],
    "exercise": ["Exercise recommendation 1"],
    "lifestyle": ["Lifestyle change 1", "Lifestyle change 2"],
    "screenings": ["Recommended screening 1"]
  },
  "summary": "Brief overall health assessment summary"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsed;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = { rawAnalysis: responseText, bmi, waistToHeightRatio };
    }

    res.json({ success: true, prediction: parsed });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Prediction failed: ' + err.message });
  }
});

module.exports = router;
