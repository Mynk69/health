import { useState } from 'react'

const styles = `
.predict-page {
  min-height: 100vh;
  padding: 120px 24px 60px;
  position: relative;
  z-index: 1;
}

.predict-container {
  max-width: 900px;
  margin: 0 auto;
}

.predict-header {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeInUp 0.6s ease;
}

.predict-header h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.predict-header p {
  font-size: 1.1rem;
  color: var(--gray-500);
}

/* Progress Bar */
.progress-bar-container {
  margin-bottom: 36px;
  animation: fadeInDown 0.5s ease;
}

.progress-steps {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.progress-step {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  border: 2px solid var(--gray-200);
  color: var(--gray-400);
  background: white;
}

.progress-step.active {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-color: var(--primary-500);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.progress-step.completed {
  background: var(--accent-emerald);
  color: white;
  border-color: var(--accent-emerald);
}

.progress-line {
  width: 40px;
  height: 2px;
  background: var(--gray-200);
  align-self: center;
  transition: background 0.3s;
}

.progress-line.filled {
  background: var(--accent-emerald);
}

/* Form */
.predict-form {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 24px;
  padding: 40px;
  animation: fadeInUp 0.7s ease;
}

.form-step-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-700);
}

.form-group input,
.form-group select {
  padding: 14px 18px;
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 14px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary-400);
  background: white;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

/* BMI Card */
.bmi-card {
  background: linear-gradient(135deg, var(--primary-50), rgba(20, 184, 166, 0.05));
  border-radius: 18px;
  padding: 24px;
  text-align: center;
  margin-top: 20px;
  border: 1px solid var(--primary-200);
}

.bmi-value {
  font-family: 'Outfit', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: var(--primary-600);
}

.bmi-label {
  font-size: 0.9rem;
  color: var(--gray-500);
  margin-top: 4px;
}

.bmi-category {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 10px;
}

.bmi-category.underweight { background: #dbeafe; color: #2563eb; }
.bmi-category.normal { background: #d1fae5; color: #059669; }
.bmi-category.overweight { background: #fef3c7; color: #d97706; }
.bmi-category.obese { background: #fee2e2; color: #dc2626; }

/* Form buttons */
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 16px;
}

.form-btn {
  padding: 14px 32px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-btn.back {
  background: var(--gray-100);
  color: var(--gray-600);
}

.form-btn.back:hover {
  background: var(--gray-200);
}

.form-btn.next {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
  flex: 1;
  max-width: 300px;
}

.form-btn.next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.form-btn.next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading */
.predict-loading {
  text-align: center;
  padding: 60px 0;
  animation: fadeIn 0.5s ease;
}

.predict-loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid var(--primary-100);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
  margin: 0 auto 20px;
}

/* Results */
.predict-results {
  margin-top: 40px;
  animation: fadeInUp 0.7s ease;
}

.predict-results h2 {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 24px;
}

.overall-risk {
  text-align: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(14, 165, 233, 0.1);
}

.risk-level {
  display: inline-block;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.risk-level.low { background: #d1fae5; color: #059669; }
.risk-level.moderate { background: #fef3c7; color: #d97706; }
.risk-level.high { background: #fee2e2; color: #dc2626; }
.risk-level.very-high { background: #fca5a5; color: #991b1b; }

.risk-cards {
  display: grid;
  gap: 16px;
}

.risk-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
}

.risk-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.1);
}

.risk-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.risk-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

.risk-badge {
  padding: 4px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.risk-badge.low { background: #d1fae5; color: #059669; }
.risk-badge.moderate { background: #fef3c7; color: #d97706; }
.risk-badge.high { background: #fee2e2; color: #dc2626; }

.risk-factors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.risk-factor-tag {
  padding: 4px 12px;
  background: var(--primary-50);
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--primary-700);
}

.risk-prevention {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.risk-prevention li {
  padding: 8px 12px;
  background: var(--gray-50);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--gray-600);
}

.risk-prevention li::before {
  content: '💡 ';
}

/* Recommendations grid */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.rec-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(14, 165, 233, 0.1);
}

.rec-card h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rec-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rec-list li {
  font-size: 0.9rem;
  color: var(--gray-600);
  padding: 6px 0;
  border-bottom: 1px solid var(--gray-100);
}

.rec-list li:last-child { border-bottom: none; }

.summary-card {
  background: linear-gradient(135deg, var(--primary-50), rgba(20, 184, 166, 0.05));
  border-radius: 18px;
  padding: 28px;
  margin-top: 24px;
  border: 1px solid var(--primary-200);
  text-align: center;
}

.summary-card p {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--gray-700);
}

.predict-again-btn {
  display: block;
  margin: 30px auto;
  padding: 16px 40px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
}

.predict-again-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.4);
}

.error-msg {
  text-align: center;
  padding: 24px;
  background: rgba(244, 63, 94, 0.05);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 16px;
  color: var(--accent-rose);
  font-weight: 500;
}

@media (max-width: 600px) {
  .predict-header h1 { font-size: 2rem; }
  .predict-form { padding: 24px; }
  .form-grid { grid-template-columns: 1fr; }
  .form-buttons { flex-direction: column; }
  .recommendations-grid { grid-template-columns: 1fr; }
}
`

const API_URL = '/api'

export default function HealthPredict() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    age: '', gender: '', height: '', weight: '', waist: '',
    bloodPressureSystolic: '', bloodPressureDiastolic: '',
    smokingStatus: '', exerciseFrequency: '', familyHistory: '',
    diet: '', sleepHours: '', stressLevel: '', alcoholConsumption: ''
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const bmi = form.height && form.weight ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) : null
  const bmiCategory = bmi ? (bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese') : null

  const predict = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.prediction)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep(1)
    setResults(null)
    setError(null)
    setForm({ age: '', gender: '', height: '', weight: '', waist: '', bloodPressureSystolic: '', bloodPressureDiastolic: '', smokingStatus: '', exerciseFrequency: '', familyHistory: '', diet: '', sleepHours: '', stressLevel: '', alcoholConsumption: '' })
  }

  const riskLevelClass = (level) => {
    if (!level) return 'low'
    const l = level.toLowerCase().replace(' ', '-')
    if (l.includes('very')) return 'very-high'
    if (l.includes('high')) return 'high'
    if (l.includes('moderate')) return 'moderate'
    return 'low'
  }

  return (
    <>
      <style>{styles}</style>
      <div className="predict-page">
        <div className="predict-container">
          <div className="predict-header">
            <h1>🔍 <span className="gradient-text">Health Prediction</span></h1>
            <p>Are you healthy? Get check by answering simple questions</p>
          </div>

          {!results && !loading && (
            <>
              <div className="progress-bar-container">
                <div className="progress-steps">
                  {[1, 2, 3].map(s => (
                    <div key={s} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className={`progress-step ${step === s ? 'active' : step > s ? 'completed' : ''}`}>
                        {step > s ? '✓' : s}
                      </div>
                      {s < 3 && <div className={`progress-line ${step > s ? 'filled' : ''}`} />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="predict-form">
                {step === 1 && (
                  <>
                    <h3 className="form-step-title">📏 Basic Body Metrics</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Age</label>
                        <input type="number" placeholder="e.g. 30" value={form.age} onChange={e => update('age', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select value={form.gender} onChange={e => update('gender', e.target.value)}>
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Height (cm)</label>
                        <input type="number" placeholder="e.g. 175" value={form.height} onChange={e => update('height', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" placeholder="e.g. 70" value={form.weight} onChange={e => update('weight', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Waist Circumference (cm)</label>
                        <input type="number" placeholder="e.g. 80" value={form.waist} onChange={e => update('waist', e.target.value)} />
                      </div>
                    </div>
                    {bmi && (
                      <div className="bmi-card">
                        <div className="bmi-value">{bmi}</div>
                        <div className="bmi-label">Body Mass Index (BMI)</div>
                        <div className={`bmi-category ${bmiCategory}`}>
                          {bmiCategory === 'underweight' ? '⚡ Underweight' : bmiCategory === 'normal' ? '✅ Normal' : bmiCategory === 'overweight' ? '⚠️ Overweight' : '🔴 Obese'}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="form-step-title">🏥 Health Vitals</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Blood Pressure - Systolic (mmHg)</label>
                        <input type="number" placeholder="e.g. 120" value={form.bloodPressureSystolic} onChange={e => update('bloodPressureSystolic', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Blood Pressure - Diastolic (mmHg)</label>
                        <input type="number" placeholder="e.g. 80" value={form.bloodPressureDiastolic} onChange={e => update('bloodPressureDiastolic', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Family History of Diseases</label>
                        <select value={form.familyHistory} onChange={e => update('familyHistory', e.target.value)}>
                          <option value="">Select</option>
                          <option value="None">None</option>
                          <option value="Diabetes">Diabetes</option>
                          <option value="Heart Disease">Heart Disease</option>
                          <option value="Cancer">Cancer</option>
                          <option value="Hypertension">Hypertension</option>
                          <option value="Multiple">Multiple conditions</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Sleep Hours per Night</label>
                        <input type="number" placeholder="e.g. 7" value={form.sleepHours} onChange={e => update('sleepHours', e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="form-step-title">🌿 Lifestyle Factors</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Smoking Status</label>
                        <select value={form.smokingStatus} onChange={e => update('smokingStatus', e.target.value)}>
                          <option value="">Select</option>
                          <option value="Never">Never smoked</option>
                          <option value="Former">Former smoker</option>
                          <option value="Current">Current smoker</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Exercise Frequency</label>
                        <select value={form.exerciseFrequency} onChange={e => update('exerciseFrequency', e.target.value)}>
                          <option value="">Select</option>
                          <option value="None">No exercise</option>
                          <option value="1-2 times/week">1-2 times/week</option>
                          <option value="3-4 times/week">3-4 times/week</option>
                          <option value="5+ times/week">5+ times/week</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Diet Type</label>
                        <select value={form.diet} onChange={e => update('diet', e.target.value)}>
                          <option value="">Select</option>
                          <option value="Balanced">Balanced</option>
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Junk Food Heavy">Junk Food Heavy</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Stress Level</label>
                        <select value={form.stressLevel} onChange={e => update('stressLevel', e.target.value)}>
                          <option value="">Select</option>
                          <option value="Low">Low</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
                          <option value="Very High">Very High</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Alcohol Consumption</label>
                        <select value={form.alcoholConsumption} onChange={e => update('alcoholConsumption', e.target.value)}>
                          <option value="">Select</option>
                          <option value="None">None</option>
                          <option value="Occasionally">Occasionally</option>
                          <option value="Regularly">Regularly</option>
                          <option value="Heavy">Heavy</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-buttons">
                  {step > 1 && <button className="form-btn back" onClick={() => setStep(step - 1)}>← Back</button>}
                  {step < 3 ? (
                    <button className="form-btn next" onClick={() => setStep(step + 1)} disabled={step === 1 && (!form.age || !form.gender || !form.height || !form.weight)} style={{ marginLeft: 'auto' }}>
                      Next Step →
                    </button>
                  ) : (
                    <button className="form-btn next" onClick={predict} disabled={loading} style={{ marginLeft: 'auto' }}>
                      🔮 Predict Health Risks
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {loading && (
            <div className="predict-loading">
              <div className="predict-loading-spinner" />
              <div style={{ fontSize: '1.1rem', color: 'var(--gray-600)', fontWeight: 500 }}>Analyzing your health data...</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-400)', marginTop: 8 }}>Our AI is predicting potential health risks</div>
            </div>
          )}

          {error && <div className="error-msg">⚠️ {error}</div>}

          {results && !results.rawAnalysis && (
            <div className="predict-results">
              <h2>📊 <span className="gradient-text">Prediction Results</span></h2>

              <div className="overall-risk">
                <div className={`risk-level ${riskLevelClass(results.overallRiskLevel)}`}>{results.overallRiskLevel} Risk</div>
                <div style={{ marginTop: 12, fontSize: '1rem', color: 'var(--gray-600)' }}>
                  BMI: <strong>{results.bmi}</strong> ({results.bmiCategory})
                  {results.waistToHeightRatio !== 'N/A' && <> | WHtR: <strong>{results.waistToHeightRatio}</strong></>}
                </div>
              </div>

              {results.risks?.length > 0 && (
                <div className="risk-cards">
                  {results.risks.map((risk, i) => (
                    <div key={i} className="risk-card">
                      <div className="risk-card-header">
                        <h3>{risk.disease}</h3>
                        <span className={`risk-badge ${riskLevelClass(risk.riskLevel)}`}>{risk.riskLevel} — {risk.probability}</span>
                      </div>
                      {risk.factors?.length > 0 && (
                        <div className="risk-factors">
                          {risk.factors.map((f, j) => <span key={j} className="risk-factor-tag">{f}</span>)}
                        </div>
                      )}
                      {risk.prevention?.length > 0 && (
                        <ul className="risk-prevention">
                          {risk.prevention.map((p, j) => <li key={j}>{p}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {results.recommendations && (
                <div className="recommendations-grid">
                  {results.recommendations.diet?.length > 0 && (
                    <div className="rec-card">
                      <h4>🥗 Diet</h4>
                      <ul className="rec-list">{results.recommendations.diet.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    </div>
                  )}
                  {results.recommendations.exercise?.length > 0 && (
                    <div className="rec-card">
                      <h4>🏃 Exercise</h4>
                      <ul className="rec-list">{results.recommendations.exercise.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    </div>
                  )}
                  {results.recommendations.lifestyle?.length > 0 && (
                    <div className="rec-card">
                      <h4>🌿 Lifestyle</h4>
                      <ul className="rec-list">{results.recommendations.lifestyle.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    </div>
                  )}
                  {results.recommendations.screenings?.length > 0 && (
                    <div className="rec-card">
                      <h4>🩺 Screenings</h4>
                      <ul className="rec-list">{results.recommendations.screenings.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}

              {results.summary && (
                <div className="summary-card">
                  <p>📝 {results.summary}</p>
                </div>
              )}

              <button className="predict-again-btn" onClick={reset}>🔄 Predict Again</button>
            </div>
          )}

          {results?.rawAnalysis && (
            <div className="predict-results">
              <h2>📊 Prediction Results</h2>
              <div style={{ background: 'var(--gray-50)', borderRadius: 16, padding: 24, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {results.rawAnalysis}
              </div>
              <button className="predict-again-btn" onClick={reset}>🔄 Predict Again</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
