const FeaturesSection = () => {
  const features = [
    {
      icon: "🐄",
      title: "Animal Management",
      description:
        "Manage all your animals in one place. Track breed, age, weight, milk production and other important details.",
    },
    {
      icon: "🥛",
      title: "Milk Tracking",
      description:
        "Record daily milk production, monitor performance and understand your dairy farm's productivity.",
    },
    {
      icon: "❤️",
      title: "Health Monitoring",
      description:
        "Keep track of vaccinations, diseases, treatments and health records of every animal.",
    },
    {
      icon: "🤖",
      title: "AI Insights",
      description:
        "Get intelligent recommendations and insights to improve animal health, milk production and farm management.",
    },
    {
      icon: "🌾",
      title: "Feed Management",
      description:
        "Plan and manage animal feed according to the nutritional requirements of your cattle.",
    },
    {
      icon: "📈",
      title: "Farm Analytics",
      description:
        "Analyze your farm performance with simple reports, statistics and useful data-driven insights.",
    },
  ]

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Our Features
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Everything You Need to
            <span className="text-green-600"> Grow Your Dairy</span>
          </h2>

          <p className="mt-5 text-gray-600 text-base sm:text-lg leading-relaxed">
            DairySaathi brings powerful tools together in one simple platform
            to help farmers manage their dairy business more efficiently.
          </p>

        </div>


        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-3xl mb-6 group-hover:bg-green-600 transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Learn More */}
              <button className="mt-5 text-green-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More
                <span>→</span>
              </button>

            </div>
          ))}

        </div>


        {/* Bottom CTA */}
        <div className="mt-14 text-center">

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-300 hover:shadow-lg">
            Explore All Features →
          </button>

        </div>

      </div>

    </section>
  )
}

export default FeaturesSection