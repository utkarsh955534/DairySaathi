const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-2 mb-5">
              <img
                src="/mainlogo.png"
                alt="DairySaathi Logo"
                className="h-16 w-auto invert"
              />

              <h2 className="text-2xl font-bold text-green-400">
                DairySaathi
              </h2>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-sm">
              Empowering dairy farmers with smart technology, AI-powered
              insights and better tools for a prosperous dairy future.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 transition"
              >
                f
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 transition"
              >
                𝕏
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 transition"
              >
                in
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 transition"
              >
                ▶
              </a>

            </div>

          </div>


          {/* Quick Links */}
          <div>

            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Home
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Features
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Solutions
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  About Us
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Contact
                </a>
              </li>

            </ul>

          </div>


          {/* Features */}
          <div>

            <h3 className="text-lg font-semibold mb-5">
              Our Features
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Animal Management
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Milk Tracking
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Health Monitoring
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  AI Insights
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Farm Analytics
                </a>
              </li>

            </ul>

          </div>


          {/* Contact */}
          <div>

            <h3 className="text-lg font-semibold mb-5">
              Contact Us
            </h3>

            <ul className="space-y-4 text-gray-400">

              <li className="flex items-start gap-3">
                <span className="text-green-400">📍</span>
                <span>
                  India
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="text-green-400">📞</span>
                <span>
                  +91 98765 43210
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="text-green-400">✉️</span>
                <span>
                  support@dairysaathi.com
                </span>
              </li>

            </ul>

          </div>

        </div>


        {/* Newsletter */}
        <div className="border-t border-slate-700 mt-12 pt-10">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

            <div>
              <h3 className="text-xl font-semibold">
                Stay Connected with DairySaathi
              </h3>

              <p className="text-gray-400 mt-2">
                Get the latest updates, tips and dairy farming insights.
              </p>
            </div>


            <div className="flex w-full lg:w-auto">

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full lg:w-72 px-4 py-3 rounded-l-lg bg-slate-800 border border-slate-700 outline-none focus:border-green-500 text-white"
              />

              <button className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-r-lg font-semibold transition">
                Subscribe
              </button>

            </div>

          </div>

        </div>


        {/* Bottom */}
        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          <p>
            © 2026 DairySaathi. All rights reserved.
          </p>

          <div className="flex gap-6">

            <a href="#" className="hover:text-green-400 transition">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-green-400 transition">
              Terms & Conditions
            </a>

          </div>

        </div>

      </div>

    </footer>
  )
}

export default Footer