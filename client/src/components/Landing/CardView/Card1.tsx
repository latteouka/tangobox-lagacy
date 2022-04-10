import { Box } from '@chakra-ui/react'
import React from 'react'
import Info from './Info'

interface CardProps {}

const Card1: React.FC<CardProps> = ({}) => {
  return (
    <Box
      w={['80%', '60%', '70%', '60%']}
      h={['85%', '85%', '90%', '90%']}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      shadow="md"
    >
      <>
        <Box textAlign="center">
          <Info />
        </Box>
      </>
    </Box>
  )
}

export default Card1
