import { Center } from '@chakra-ui/react'
import React from 'react'
import Card1 from './Card1'

interface CardViewProps {}

const CardView: React.FC<CardViewProps> = ({}) => {
  return (
    <Center
      maxW="1200px"
      w={['100%', '100%', '100%', '100%']}
      h={['90vh', '90vh', '85vh', '85vh']}
      flexDir="column"
    >
      <Card1 />
    </Center>
  )
}

export default CardView
