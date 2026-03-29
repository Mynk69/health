import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

// POST /api/predict
router.post('/', async (req, res) => {
  try {
    const {
      age, gender, height, weight, waist,
      bloodPressureSystolic, bloodPressureDiastolic,
      smokingStatus, exerciseFrequency, familyHistory,
      diet, sleepHours, stressLevel, alcoholConsumption
    } = req.body

    if (!age || !gender || !height || !weight) {
      return res.status(400).json({ error: 'Age, gender, height, and weight are required' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: 'Gemini API key not configured. Please add your key to server/.env' })
    }

    // Calculate BMI
    const heightM = parseFloat(height) / 100
    const bmi = (parseFloat(weight) / (heightM * heightM)).toFixed(1)

    // Calculate waist-to-height ratio if waist is provided
    const whr = waist ? (parseFloat(waist) / parseFloat(height)).toFixed(2) : 'N/A'

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are an advanced AI health risk assessment engine. Analyze the following patient data and predict potential health risks.

Patient Data:
- Age: ${age} years
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- BMI: ${bmi}
- Waist Circumference: ${waist || 'Not provided'} cm
- Waist-to-Height Ratio: ${whr}
- Blood Pressure: ${bloodPressureSystolic || 'N/A'}/${bloodPressureDiastolic || 'N/A'} mmHg
- Smoking Status: ${smokingStatus || 'Not provided'}
- Exercise Frequency: ${exerciseFrequency || 'Not provided'}
- Family History: ${familyHistory || 'Not provided'}
- Diet Type: ${diet || 'Not provided'}
- Sleep Hours: ${sleepHours || 'N/A'} hours/night
- Stress Level: ${stressLevel || 'Not provided'}
- Alcohol Consumption: ${alcoholConsumption || 'Not provided'}

Provide your prediction in the following strict JSON format (no markdown, no code fences, just raw JSON):
{
  "overallRiskLevel": "Low" or "Moderate" or "High" or "Very High",
  "bmi": "${bmi}",
  "bmiCategory": "Underweight" or "Normal" or "Overweight" or "Obese",
  "waistToHeightRatio": "${whr}",
  "risks": [
    {
      "disease": "Disease or condition name",
      "riskLevel": "Low" or "Moderate" or "High",
      "probability": "Percentage estimate like 15%",
      "factors": ["Contributing factor 1", "Contributing factor 2"],
      "prevention": ["Prevention tip 1", "Prevention tip 2"]
    }
  ],
  "recommendations": {
    "diet": ["Specific diet recommendation 1", "Specific diet recommendation 2"],
    "exercise": ["Exercise recommendation 1", "Exercise recommendation 2"],
    "lifestyle": ["Lifestyle change 1", "Lifestyle change 2"],
    "screenings": ["Recommended screening 1", "Recommended screening 2"]
  },
  "summary": "A brief 2-3 sentence summary of overall health status and key action items"
}

Guidelines:
- Predict at least 3-5 potential health risks based on the data
- Be realistic with probability estimates
- Provide actionable, specific prevention tips
- Focus on diet-based healing and natural wellness
- Include at least 3-4 items in each recommendation category
- Consider the interactions between different risk factors
- Always recommend professional medical consultation`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Try to parse as JSON
    try {
      let cleanJson = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim()

      const prediction = JSON.parse(cleanJson)
      res.json({ prediction })
    } catch (parseErr) {
      // If JSON parsing fails, return raw text
      console.log('JSON parse failed for prediction, returning raw analysis')
      res.json({ prediction: { rawAnalysis: responseText } })
    }

  } catch (error) {
    console.error('Prediction error:', error)
    res.status(500).json({
      error: error.message || 'Failed to predict health risks. Please try again.'
    })
  }
})

export default router
