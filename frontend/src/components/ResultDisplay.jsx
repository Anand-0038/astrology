export default function ResultDisplay({ result }) {
  if (!result) return null

  const { analysis, interpretation, sections, remedies, confidence_score, warnings } = result

  // Zodiac symbol mapping
  const zodiacSymbols = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  }

  const getSymbol = (sign) => zodiacSymbols[sign] || '⭐'

  return (
    <div className="mt-8 space-y-6 animate-fadeIn">
      {/* Confidence Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
          <span className="text-sm text-gray-300">Confidence:</span>
          <div className="flex items-center gap-1">
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-star-gold to-yellow-300 rounded-full transition-all duration-1000"
                style={{ width: `${(confidence_score || 0.8) * 100}%` }}
              />
            </div>
            <span className="text-star-gold font-semibold">{Math.round((confidence_score || 0.8) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      {analysis && Object.keys(analysis).length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-star-gold mb-4 flex items-center gap-2">
            ✨ Natal Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {analysis.sun && (
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl">☀️</div>
                <div className="text-xs text-gray-400">Sun</div>
                <div className="font-semibold text-yellow-300">{analysis.sun}</div>
              </div>
            )}
            {analysis.moon && (
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl">🌙</div>
                <div className="text-xs text-gray-400">Moon</div>
                <div className="font-semibold text-blue-300">{analysis.moon}</div>
              </div>
            )}
            {analysis.ascendant && (
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl">⬆️</div>
                <div className="text-xs text-gray-400">Rising</div>
                <div className="font-semibold text-purple-300">{analysis.ascendant}</div>
              </div>
            )}
            {analysis.sign && (
              <div className="bg-white/5 rounded-lg p-3 text-center col-span-full">
                <div className="text-3xl">{getSymbol(analysis.sign)}</div>
                <div className="text-xs text-gray-400">Your Sign</div>
                <div className="font-semibold text-star-gold text-lg">{analysis.sign}</div>
              </div>
            )}
          </div>

          {/* Compatibility Scores if present */}
          {analysis.compatibility_score !== undefined && (
            <div className="mt-4 text-center">
              <div className="text-4xl font-bold text-star-gold">{analysis.compatibility_score}%</div>
              <div className="text-sm text-gray-400">Overall Compatibility</div>
            </div>
          )}

          {/* Major Aspects */}
          {analysis.major_aspects && analysis.major_aspects.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Major Aspects</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.major_aspects.map((aspect, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-sm">
                    {aspect.between} ({aspect.type})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Interpretation */}
      {interpretation && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-star-gold mb-4 flex items-center gap-2">
            🔮 Your Reading
          </h3>
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">{interpretation}</p>
        </div>
      )}

      {/* Sections */}
      {sections && sections.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-star-gold mb-4">📚 Deep Dive</h3>
          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={i} className="border-l-2 border-star-gold/50 pl-4">
                <h4 className="font-semibold text-white mb-1">{section.title}</h4>
                <p className="text-gray-300 text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remedies */}
      {remedies && remedies.length > 0 && (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-green-900/20 to-transparent">
          <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
            💡 Practical Remedies
          </h3>
          <ul className="space-y-3">
            {remedies.map((remedy, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 border border-green-500/30 rounded-full 
                  flex items-center justify-center text-sm text-green-400 font-semibold">
                  {i + 1}
                </span>
                <span className="text-gray-200">{remedy}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm">
            ⚠️ Note: {warnings.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
