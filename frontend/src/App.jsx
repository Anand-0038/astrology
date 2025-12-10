import { useState } from 'react'
import Header from './components/Header'
import FeatureSelector from './components/FeatureSelector'
import NatalChartForm from './components/NatalChartForm'
import QuickHoroscopeForm from './components/QuickHoroscopeForm'
import CompatibilityForm from './components/CompatibilityForm'
import ResultDisplay from './components/ResultDisplay'
import Stars from './components/Stars'
import Disclaimer from './components/Disclaimer'

function App() {
  const [activeFeature, setActiveFeature] = useState('quick')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResult = (data) => {
    setResult(data)
    setError(null)
  }

  const handleError = (err) => {
    setError(err)
    setResult(null)
  }

  const handleLoading = (isLoading) => {
    setLoading(isLoading)
  }

  const resetResult = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen text-white relative">
      <Stars />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        
        <FeatureSelector 
          activeFeature={activeFeature} 
          onSelect={(f) => { setActiveFeature(f); resetResult(); }} 
        />

        <div className="mt-8">
          {activeFeature === 'natal' && (
            <NatalChartForm 
              onResult={handleResult}
              onError={handleError}
              onLoading={handleLoading}
            />
          )}
          
          {activeFeature === 'quick' && (
            <QuickHoroscopeForm 
              onResult={handleResult}
              onError={handleError}
              onLoading={handleLoading}
            />
          )}
          
          {activeFeature === 'compatibility' && (
            <CompatibilityForm 
              onResult={handleResult}
              onError={handleError}
              onLoading={handleLoading}
            />
          )}
        </div>

        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <div className="loading-stars">
              <div className="loading-star"></div>
              <div className="loading-star"></div>
              <div className="loading-star"></div>
            </div>
            <p className="mt-4 text-star-gold text-lg animate-pulse">
              Charting the stars... ✨
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-500 rounded-xl p-4 text-center">
            <p className="text-red-300">⚠️ {error}</p>
          </div>
        )}

        {result && !loading && (
          <ResultDisplay result={result} />
        )}

        <Disclaimer />
      </div>
    </div>
  )
}

export default App
