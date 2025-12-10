import { useState } from 'react'
import axios from 'axios'

export default function NatalChartForm({ onResult, onError, onLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    birth_time: '',
    birth_city: '',
    birth_country: '',
    tone: 'friendly'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.birth_date) {
      onError('Please enter your birth date')
      return
    }
    if (!formData.birth_city || !formData.birth_country) {
      onError('Please enter your birth place')
      return
    }

    onLoading(true)
    try {
      const response = await axios.post('/api/natal-chart', {
        name: formData.name || 'Friend',
        birth_date: formData.birth_date,
        birth_time: formData.birth_time || 'unknown',
        birth_timezone: '+05:30',
        birth_place: {
          city: formData.birth_city,
          country: formData.birth_country
        },
        tone: formData.tone
      })
      onResult(response.data)
    } catch (err) {
      onError(err.response?.data?.detail || 'Failed to generate chart. Please try again.')
    } finally {
      onLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-star-gold mb-4">🌟 Birth Chart Reading</h2>
      <p className="text-gray-300 mb-6">Enter your birth details for a personalized natal chart</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Optional — for personalization"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
              focus:border-star-gold focus:outline-none focus:ring-1 focus:ring-star-gold
              placeholder-gray-500"
          />
        </div>

        {/* Birth Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Birth Date *</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                focus:border-star-gold focus:outline-none focus:ring-1 focus:ring-star-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Birth Time</label>
            <input
              type="time"
              name="birth_time"
              value={formData.birth_time}
              onChange={handleChange}
              placeholder="HH:MM (24h) or leave empty"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                focus:border-star-gold focus:outline-none focus:ring-1 focus:ring-star-gold"
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty if unknown (results will be approximate)</p>
          </div>
        </div>

        {/* Birth Place */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Birth City *</label>
            <input
              type="text"
              name="birth_city"
              value={formData.birth_city}
              onChange={handleChange}
              placeholder="e.g., Chennai"
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                focus:border-star-gold focus:outline-none focus:ring-1 focus:ring-star-gold
                placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country *</label>
            <input
              type="text"
              name="birth_country"
              value={formData.birth_country}
              onChange={handleChange}
              placeholder="e.g., India"
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                focus:border-star-gold focus:outline-none focus:ring-1 focus:ring-star-gold
                placeholder-gray-500"
            />
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium mb-2">Reading Style</label>
          <div className="flex gap-2">
            {['friendly', 'concise', 'mystical'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, tone: t })}
                className={`px-4 py-2 rounded-lg border transition-all capitalize
                  ${formData.tone === t 
                    ? 'border-star-gold bg-star-gold/20 text-star-gold' 
                    : 'border-white/20 hover:border-white/40'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-star-gold rounded-xl font-semibold
            hover:from-purple-500 hover:to-yellow-400 transition-all duration-300
            shadow-lg hover:shadow-star-gold/30 mt-4"
        >
          🌟 Generate Birth Chart
        </button>
      </form>
    </div>
  )
}
