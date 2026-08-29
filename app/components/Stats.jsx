import React from 'react'

const Stats = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 px-5 sm:px-8 lg:px-10">
        

        <div className="relative z-20 bg-white rounded-2xl shadow-xl -mt-4 lg:-mt-10 mb-10 grid grid-cols-2 lg:grid-cols-4 divide-x-0 lg:divide-x divide-gray-200">

          {/* Farmers */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-2">
              👨‍🌾
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              12,500+
            </h3>

            <p className="text-gray-500">
              Farmers
            </p>
          </div>

          {/* Animals */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-2">
              🐄
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              85,000+
            </h3>

            <p className="text-gray-500">
              Animals
            </p>
          </div>

          {/* Milk */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-2">
              🥛
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              2.5 L+
            </h3>

            <p className="text-gray-500">
              Liters Milk / Day
            </p>
          </div>

          {/* Villages */}
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-2">
              🏡
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              320+
            </h3>

            <p className="text-gray-500">
              Villages
            </p>
          </div>

        </div>
    </div>
  )
}

export default Stats
