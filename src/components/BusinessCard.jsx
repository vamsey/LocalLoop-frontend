import { Star, Phone } from "lucide-react";

function BusinessCard({ business }) {

const rating = (4 + Math.random()).toFixed(1); // fake rating for UI

return (

<div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300 border">

  {/* Image Placeholder */}

  <div className="h-40 bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg font-semibold">
    {business.name}
  </div>

  <div className="p-5">

    {/* Title */}

    <h2 className="text-xl font-semibold text-gray-800">
      {business.name}
    </h2>

    {/* Category Badge */}

    <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600 font-medium">
      {business.category}
    </span>

    {/* Description */}

    <p className="mt-3 text-sm text-gray-500 line-clamp-2">
      {business.description}
    </p>

    {/* Rating */}

    <div className="flex items-center gap-1 mt-3 text-yellow-500">

      <Star size={16} fill="currentColor" />

      <span className="text-sm text-gray-700">
        {rating}
      </span>

    </div>

    {/* Contact Button */}

    <button className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">

      <Phone size={16} />

      Contact

    </button>

  </div>

</div>

);

}

export default BusinessCard;
