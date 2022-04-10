import React from 'react'
import { Center, Text } from '@chakra-ui/react'

interface FrontProps {
  kotoba: string
}

const Front: React.FC<FrontProps> = ({ kotoba }) => {
  return (
    <Center h="100%">
      <Text
        fontSize={{
          base: '30px',
          sm: '35px',
          md: '40px',
          lg: '40px',
          xl: '40px',
        }}
        color="blackAlpha"
        fontWeight="bold"
      >
        {kotoba}
      </Text>
    </Center>
  )
}

export default Front
