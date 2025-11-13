export default function GameCard({ game, onBuy }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col">
      {game.images?.[0] ? (
        <img src={game.images[0]} alt={game.title} className="w-full h-40 object-cover rounded mb-3" />
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">No Image</div>
      )}
      <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{game.description || 'No description'}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-purple-700 font-bold">৳ {game.price}</span>
        <button onClick={() => onBuy(game)} className="px-3 py-1.5 bg-purple-600 text-white rounded">Buy</button>
      </div>
    </div>
  )
}
