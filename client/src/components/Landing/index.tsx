import { Divider } from '@chakra-ui/react'
import React from 'react'
import Footer from './Footer'
import CardView from './CardView'

const Landing: React.FC = () => {
  return (
    <>
      <CardView />
      <Divider />
      <Footer />
    </>
  )
}

export default Landing
