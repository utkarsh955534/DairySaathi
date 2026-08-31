"use client"

import { useState } from "react"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="relative z-[999] bg-white px-4 sm:px-6 lg:px-10 py-3 shadow-sm">

      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/mainlogo.png"
            alt="DairySaathi Logo"
            className="h-12 sm:h-14 lg:h-16 w-auto"
          />

          <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-700 font-bold">
            DairySaathi
          </h1>
        </div>


        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">

          <ul className="flex items-center gap-7 font-medium text-gray-700">
            <li className="hover:text-green-600 cursor-pointer">
              Home
            </li>

            <li className="hover:text-green-600 cursor-pointer">
              Features
            </li>

            <li className="hover:text-green-600 cursor-pointer">
              Solutions
            </li>

            <li className="hover:text-green-600 cursor-pointer">
              About
            </li>

            <li className="hover:text-green-600 cursor-pointer">
              Contact
            </li>
          </ul>


          {/* Login */}
          <a href="login">
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md"
          >
            Login
          </button>
          </a>


          {/* Language */}
          
          <button
            type="button"
            className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
          >
            EN
            <span className="text-xs">⌄</span>
          </button>
          

        </div>


        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden relative z-[1000] flex flex-col justify-center items-center gap-1.5 w-11 h-11 rounded-md bg-white border border-gray-200"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >

          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              menuOpen
                ? "rotate-45 translate-y-2"
                : ""
            }`}
          />

          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              menuOpen
                ? "opacity-0"
                : "opacity-100"
            }`}
          />

          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              menuOpen
                ? "-rotate-45 -translate-y-2"
                : ""
            }`}
          />

        </button>

      </div>


      {/* Mobile / Tablet Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >

        <div className="border-t border-gray-200 mt-3 pt-5 pb-3">

          <ul className="flex flex-col gap-4 font-medium text-gray-700">

            <li
              onClick={closeMenu}
              className="hover:text-green-600 cursor-pointer"
            >
              Home
            </li>

            <li
              onClick={closeMenu}
              className="hover:text-green-600 cursor-pointer"
            >
              Features
            </li>

            <li
              onClick={closeMenu}
              className="hover:text-green-600 cursor-pointer"
            >
              Solutions
            </li>

            <li
              onClick={closeMenu}
              className="hover:text-green-600 cursor-pointer"
            >
              About
            </li>

            <li
              onClick={closeMenu}
              className="hover:text-green-600 cursor-pointer"
            >
              Contact
            </li>

          </ul>


          {/* Mobile Actions */}
          <div className="flex items-center gap-3 mt-5">

           <a href="login"> <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md"
            >
              Login
            </button>
            </a>

            <button
              type="button"
              className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              EN
              <span className="text-xs">⌄</span>
            </button>

          </div>

        </div>

      </div>

    </nav>
  )
}

export default Navbar