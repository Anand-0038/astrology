export default function FeatureSelector({ activeFeature, onSelect }) {
  const features = [
    { id: 'quick', label: '⚡ Quick Horoscope', desc: 'Daily guidance by sign' },
    { id: 'natal', label: '🌟 Birth Chart', desc: 'Full natal reading' },
    { id: 'compatibility', label: '💕 Compatibility', desc: 'Compare two charts' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {features.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left
            ${activeFeature === f.id 
              ? 'border-star-gold bg-star-gold/20 shadow-lg shadow-star-gold/20' 
              : 'border-white/20 bg-white/5 hover:border-star-gold/50 hover:bg-white/10'
            }`}
        >
          <div className="text-xl font-semibold">{f.label}</div>
          <div className="text-sm text-gray-400 mt-1">{f.desc}</div>
        </button>
      ))}
    </div>
  )
}
