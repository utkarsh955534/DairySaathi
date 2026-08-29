import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Stats from './components/Stats'
import FeaturesSection from './components/FeaturesSection'
import Footer from './components/Footer'

const page = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <Stats/>
      <FeaturesSection/>
      <Footer/>
    </div>
  )
}

export default page
