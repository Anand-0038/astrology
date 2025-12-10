import { useState } from 'react'
import axios from 'axios'

export default function CompatibilityForm({ onResult, onError, onLoading }) {
  const [personA, setPersonA] = useState({
    name: '',
    birth_date: '',
    birth_time: '',
    birth_city: '',
    birth_country: ''
  })
  const [personB, setPersonB] = useState({
    name: '',
    birth_date: '',
    birth_time: '',
    birth_city: '',
    birth_country: ''
  })
  const [focus, setFocus] = useState('romantic')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!personA.birth_date || !personB.birth_date) {
      onError('Please enter birth dates for both people')
      return
    }
    if (!personA.birth_city || !personB.birth_city) {
      onError('Please enter birth cities for both people')
      return
    }

    onLoading(true)
    try {
      const response = await axios.post('/api/compatibility', {
        person_a_name: personA.name || 'Person A',
        person_a_birth_date: personA.birth_date,
        person_a_birth_time: personA.birth_time || 'unknown',
        person_a_birth_place: {
          city: personA.birth_city,
          country: personA.birth_country || 'Unknown'
        },
        person_b_name: personB.name || 'Person B',
        person_b_birth_date: personB.birth_date,
        person_b_birth_time: personB.birth_time || 'unknown',
        person_b_birth_place: {
          city: personB.birth_city,
          country: personB.birth_country || 'Unknown'
        },
        focus: focus
      })
      onResult(response.data)
    } catch (err) {
      onError(err.response?.data?.detail || 'Failed to check compatibility. Please try again.')
    } finally {
      onLoading(false)
    }
  }

  const PersonForm = ({ person, setPerson, label, emoji }) => (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h3 className="text-lg font-semibold mb-3">{emoji} {label}</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          placeholder="Name (optional)"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
            focus:border-star-gold focus:outline-none placeholder-gray-500 text-sm"
        />
        <input
          type="date"
          value={person.birth_date}
          onChange={(e) => setPerson({ ...person, birth_date: e.target.value })}
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
            focus:border-star-gold focus:outline-none text-sm"
        />
        <input
          type="time"
          value={person.birth_time}
          onChange={(e) => setPerson({ ...person, birth_time: e.target.value })}
          placeholder="Birth time (optional)"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
            focus:border-star-gold focus:outline-none text-sm"
        />
        <input
          type="text"
          value={person.birth_city}
          onChange={(e) => setPerson({ ...person, birth_city: e.target.value })}
          placeholder="Birth city *"
          required
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
            focus:border-star-gold focus:outline-none placeholder-gray-500 text-sm"
        />
      </div>
    </div>
  )

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-star-gold mb-4">💕 Compatibility Check</h2>
      <p className="text-gray-300 mb-6">Compare birth charts to discover relationship dynamics</p>

      <form onSubmit={handleSubmit}>
        {/* Focus Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Relationship Type</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'romantic', label: '💕 Romantic' },
              { id: 'friendship', label: '🤝 Friendship' },
              { id: 'work', label: '💼 Work' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFocus(f.id)}
                className={`px-4 py-2 rounded-lg border transition-all
                  ${focus === f.id 
                    ? 'border-star-gold bg-star-gold/20 text-star-gold' 
                    : 'border-white/20 hover:border-white/40'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two Person Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <PersonForm person={personA} setPerson={setPersonA} label="Person 1" emoji="👤" />
          <PersonForm person={personB} setPerson={setPersonB} label="Person 2" emoji="👤" />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-semibold
            hover:from-pink-500 hover:to-purple-500 transition-all duration-300
            shadow-lg hover:shadow-pink-500/30"
        >
          💕 Check Compatibility
        </button>
      </form>
    </div>
  )
}
