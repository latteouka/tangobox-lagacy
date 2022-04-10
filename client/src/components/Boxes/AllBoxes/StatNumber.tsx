import {
  StatNumber as ChakraStatNumber,
  StatNumberProps,
} from '@chakra-ui/react'
import React from 'react'

export const StatNumber = (props: StatNumberProps) => (
  <ChakraStatNumber
    fontSize="2xl"
    fontWeight="medium"
    {...props}
    color="gray"
  />
)
