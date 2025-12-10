import { useState } from 'react'
import axios from 'axios'

const ZODIAC_SIGNS = [
  { sign: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { sign: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
  { sign: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' },
  { sign: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { sign: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { sign: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { sign: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { sign: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { sign: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { sign: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { sign: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { sign: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' },
]

export default function QuickHoroscopeForm({ onResult, onError, onLoading }) {
  const [selectedSign, setSelectedSign] = useState('')
  const [period, setPeriod] = useState('today')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedSign) {
      onError('Please select your zodiac sign')
      return
    }

    onLoading(true)
    try {
      const response = await axios.post('/api/quick-horoscope', {
        sign: selectedSign,
        period: period
      })
      onResult(response.data)
    } catch (err) {
      onError(err.response?.data?.detail || 'Failed to get horoscope. Please try again.')
    } finally {
      onLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-star-gold mb-4">⚡ Quick Horoscope</h2>
      <p className="text-gray-300 mb-6">Select your zodiac sign for instant guidance</p>

      <form onSubmit={handleSubmit}>
        {/* Period Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Time Period</label>
          <div className="flex gap-2">
            {['today', 'tomorrow', 'this_week'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg border transition-all
                  ${period === p 
                    ? 'border-star-gold bg-star-gold/20 text-star-gold' 
                    : 'border-white/20 hover:border-white/40'
                  }`}
              >
                {p === 'this_week' ? 'This Week' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {ZODIAC_SIGNS.map((z) => (
            <button
              key={z.sign}
              type="button"
              onClick={() => setSelectedSign(z.sign)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 text-center
                ${selectedSign === z.sign 
                  ? 'border-star-gold bg-star-gold/20 shadow-lg shadow-star-gold/20 scale-105' 
                  : 'border-white/20 bg-white/5 hover:border-star-gold/50 hover:scale-102'
                }`}
            >
              <div className="text-3xl">{z.symbol}</div>
              <div className="text-sm font-medium mt-1">{z.sign}</div>
              <div className="text-xs text-gray-400">{z.dates}</div>
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!selectedSign}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-star-gold rounded-xl font-semibold
            hover:from-purple-500 hover:to-yellow-400 transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg hover:shadow-star-gold/30"
        >
          ✨ Get Your Horoscope
        </button>
      </form>
    </div>
  )
}
