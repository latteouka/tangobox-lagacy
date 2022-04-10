import { Divider } from '@chakra-ui/react'
import React from 'react'
import Footer from './Footer'
import CardView from './CardView'

const InfoPage: React.FC = () => {
  return (
    <>
      <CardView />
      <Divider my="5" />
      <Footer />
    </>
  )
}

export default InfoPage
