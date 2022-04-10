import { Box } from '@chakra-ui/react'
import React from 'react'
import Navbar from './Navbar'

interface WrapperUProps {}

const WrapperU: React.FC<WrapperUProps> = ({ children }) => {
  return (
    <Box h="98vh">
      <Navbar />
      <Box maxW="1200px" pt="3" mx="auto" w="100%">
        {children}
      </Box>
    </Box>
  )
}

export default WrapperU
