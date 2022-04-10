import { StatLabel as ChakraStatLabel, StatLabelProps } from '@chakra-ui/react'
import React from 'react'

export const StatLabel = (props: StatLabelProps) => (
  <ChakraStatLabel fontWeight="medium" isTruncated {...props} />
)
