export default function Header() {
  return (
    <header className="text-center py-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-5xl">✨</span>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-star-gold via-yellow-200 to-star-gold 
          bg-clip-text text-transparent animate-pulse">
          AstralSage
        </h1>
        <span className="text-5xl">🌟</span>
      </div>
      <p className="text-gray-300 text-lg">
        Your Personal Astrology Guide ✨
      </p>
      <p className="text-gray-500 text-sm mt-1">
        Discover insights from the stars
      </p>
    </header>
  )
}
