import { useState, useRef } from 'react'

const styles = `
.report-page {
  min-height: 100vh;
  padding: 120px 24px 60px;
  position: relative;
  z-index: 1;
}

.report-container {
  max-width: 900px;
  margin: 0 auto;
}

.report-header {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeInUp 0.6s ease;
}

.report-header h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.report-header p {
  font-size: 1.1rem;
  color: var(--gray-500);
}

/* Upload Zone */
.upload-zone {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 2px dashed var(--primary-300);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: var(--primary-500);
  background: rgba(14, 165, 233, 0.05);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(14, 165, 233, 0.12);
}

.upload-zone.drag-over {
  border-style: solid;
}

.upload-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
  animation: float 4s ease-in-out infinite;
}

.upload-zone h3 {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: var(--gray-800);
}

.upload-zone p {
  color: var(--gray-500);
  font-size: 0.95rem;
}

.upload-zone .file-types {
  margin-top: 12px;
  font-size: 0.85rem;
  color: var(--gray-400);
}

/* Preview */
.preview-section {
  margin-top: 24px;
  animation: fadeInUp 0.5s ease;
}

.preview-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid var(--primary-200);
}

.preview-image {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid var(--primary-100);
}

.preview-info h4 {
  font-weight: 600;
  margin-bottom: 6px;
}

.preview-info p {
  font-size: 0.85rem;
  color: var(--gray-500);
}

.analyze-btn {
  margin-top: 20px;
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(14, 165, 233, 0.4);
}

.analyze-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 60px 0;
  animation: fadeIn 0.5s ease;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid var(--primary-100);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-text {
  font-size: 1.1rem;
  color: var(--gray-600);
  font-weight: 500;
}

.loading-sub {
  font-size: 0.9rem;
  color: var(--gray-400);
  margin-top: 8px;
}

/* Results */
.results-section {
  margin-top: 40px;
  animation: fadeInUp 0.7s ease;
}

.results-section h2 {
  font-size: 1.8rem;
  margin-bottom: 24px;
  text-align: center;
}

.result-cards {
  display: grid;
  gap: 20px;
}

.result-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.1);
}

.result-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.result-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.result-card-title {
  font-size: 1.2rem;
  font-weight: 700;
}

/* Medicine table */
.medicine-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.medicine-table th {
  text-align: left;
  padding: 8px 14px;
  font-size: 0.85rem;
  color: var(--gray-500);
  font-weight: 600;
}

.medicine-table td {
  padding: 12px 14px;
  background: var(--primary-50);
  font-size: 0.95rem;
}

.medicine-table td:first-child { border-radius: 10px 0 0 10px; }
.medicine-table td:last-child { border-radius: 0 10px 10px 0; }

/* List items */
.result-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-list li {
  padding: 12px 16px;
  background: var(--primary-50);
  border-radius: 12px;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.result-list li::before {
  content: '✓';
  min-width: 22px;
  height: 22px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-top: 1px;
}

/* Diet grid */
.diet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.diet-item {
  padding: 16px;
  background: var(--primary-50);
  border-radius: 14px;
  transition: all 0.3s ease;
}

.diet-item:hover {
  background: var(--primary-100);
  transform: translateY(-2px);
}

.diet-item h4 {
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.diet-item p {
  font-size: 0.85rem;
  color: var(--gray-500);
}

.diet-item .amount {
  font-size: 0.8rem;
  color: var(--primary-600);
  font-weight: 600;
  margin-top: 6px;
}

.error-message {
  text-align: center;
  padding: 30px;
  background: rgba(244, 63, 94, 0.05);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 16px;
  color: var(--accent-rose);
  font-weight: 500;
}

/* Raw analysis */
.raw-analysis {
  background: var(--gray-50);
  border-radius: 16px;
  padding: 24px;
  white-space: pre-wrap;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--gray-700);
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .report-header h1 { font-size: 2rem; }
  .upload-zone { padding: 40px 20px; }
  .preview-card { flex-direction: column; text-align: center; }
  .medicine-table { font-size: 0.85rem; }
  .diet-grid { grid-template-columns: 1fr; }
}
`

const API_URL = 'http://localhost:5000/api'

export default function ReportAnalysis() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setResults(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('report', file)
      const res = await fetch(`${API_URL}/report/analyze`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.analysis)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="report-page">
        <div className="report-container">
          <div className="report-header">
            <h1>📋 <span className="gradient-text">Report Analysis</span></h1>
            <p>Upload your medical report image for AI-powered analysis</p>
          </div>

          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">📤</div>
            <h3>Drop your medical report here</h3>
            <p>or click to browse files</p>
            <div className="file-types">Supports: JPG, PNG, JPEG, WEBP (Max 10MB)</div>
          </div>

          {preview && (
            <div className="preview-section">
              <div className="preview-card">
                <img src={preview} alt="Report preview" className="preview-image" />
                <div className="preview-info">
                  <h4>{file.name}</h4>
                  <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button className="analyze-btn" onClick={analyze} disabled={loading}>
                {loading ? '⏳ Analyzing...' : '🔬 Analyze Report'}
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner" />
              <div className="loading-text">Analyzing your report...</div>
              <div className="loading-sub">Our AI is extracting and analyzing medical data</div>
            </div>
          )}

          {error && <div className="error-message">⚠️ {error}</div>}

          {results && !results.rawAnalysis && (
            <div className="results-section">
              <h2>🩺 <span className="gradient-text">Analysis Results</span></h2>
              <div className="result-cards">
                {/* Diagnosis */}
                {results.diagnosis && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <div className="result-card-icon" style={{ background: '#e0f2fe' }}>🔍</div>
                      <h3 className="result-card-title">Diagnosis Summary</h3>
                    </div>
                    <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--gray-700)' }}>{results.diagnosis}</p>
                  </div>
                )}

                {/* Medicines */}
                {results.medicines?.length > 0 && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <div className="result-card-icon" style={{ background: '#ddd6fe' }}>💊</div>
                      <h3 className="result-card-title">Recommended Medicines</h3>
                    </div>
                    <table className="medicine-table">
                      <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
                      <tbody>
                        {results.medicines.map((m, i) => (
                          <tr key={i}><td><strong>{m.name}</strong></td><td>{m.dosage}</td><td>{m.frequency}</td><td>{m.duration}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Treatment */}
                {results.treatment?.length > 0 && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <div className="result-card-icon" style={{ background: '#d1fae5' }}>🏥</div>
                      <h3 className="result-card-title">Treatment Plan</h3>
                    </div>
                    <ul className="result-list">
                      {results.treatment.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                )}

                {/* Diet */}
                {results.diet?.length > 0 && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <div className="result-card-icon" style={{ background: '#fef3c7' }}>🥗</div>
                      <h3 className="result-card-title">Diet & Nutrition</h3>
                    </div>
                    <div className="diet-grid">
                      {results.diet.map((d, i) => (
                        <div key={i} className="diet-item">
                          <h4>🍎 {d.food}</h4>
                          <p>{d.benefit}</p>
                          <div className="amount">📏 {d.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precautions */}
                {results.precautions?.length > 0 && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <div className="result-card-icon" style={{ background: '#fee2e2' }}>⚠️</div>
                      <h3 className="result-card-title">Precautions</h3>
                    </div>
                    <ul className="result-list">
                      {results.precautions.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}

                {/* Follow Up */}
                {results.followUp && (
                  <div className="result-card">
                    <div className="result-card-header">
                      <div className="result-card-icon" style={{ background: '#e0f2fe' }}>📅</div>
                      <h3 className="result-card-title">Follow-Up</h3>
                    </div>
                    <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--gray-700)' }}>{results.followUp}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {results?.rawAnalysis && (
            <div className="results-section">
              <h2>🩺 Analysis Results</h2>
              <div className="result-card">
                <div className="raw-analysis">{results.rawAnalysis}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
