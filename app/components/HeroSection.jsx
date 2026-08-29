const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* HERO */}
        <div className="grid lg:grid-cols-2 items-center min-h-[650px] gap-10 py-12 lg:py-16">

          {/* LEFT */}
          <div className="z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm sm:text-base font-medium mb-6">
              <span>🌱</span>
              <span>Empowering Farmers, Enriching Lives</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-slate-900">
              A Stronger
              <br />
              Dairy Tomorrow,
              <br />
              <span className="text-green-600">
                Together
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
              DairySaathi empowers farmers with technology,
              AI insights and the right support to manage
              their dairy business better.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <a href="login"><button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2">
                Get Started
                <span className="text-xl">→</span>
              </button>
              </a>

              <button className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold px-7 py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  ▶
                </span>
                Watch Video
              </button>

            </div>

            {/* Trust */}
            <div className="flex items-center gap-4 mt-8">

              <div className="flex -space-x-3">

                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                  👨
                </div>

                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                  👨‍🌾
                </div>

                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                  👨
                </div>

                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                  👨‍🌾
                </div>

              </div>

              <div>
                <div className="text-yellow-500 text-lg">
                  ★ ★ ★ ★ ★
                </div>

                <p className="text-sm text-gray-600">
                  Trusted by <b>12,500+</b> farmers
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Background decoration */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-green-200 rounded-full blur-3xl opacity-40"></div>

            <img
              src="/LandingHero.png"
              alt="Dairy farmer with cows"
              className="relative z-10 w-full max-w-xl lg:max-w-2xl object-cover rounded-3xl shadow-2xl"
            />

          </div>

        </div>

        {/* STATS */}
        

      </div>
    </section>
  )
}

export default HeroSection