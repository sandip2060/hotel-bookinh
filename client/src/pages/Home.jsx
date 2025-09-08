import React from 'react'
import Hero from '../components/Hero'
import FeatureDestination from '../components/FeatureDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonials from '../components/Testimonials'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <>
        <Hero />
        <FeatureDestination />
        <ExclusiveOffers />
        <Testimonials />
        <NewsLetter />
    </>
  )
}

export default Home