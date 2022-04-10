import { Text, TextProps } from '@chakra-ui/layout'
import * as React from 'react'

export const Copyright = (props: TextProps) => (
  <>
    <Text fontSize="sm" {...props}>
      &copy; {new Date().getFullYear()} tangobox.app All rights reserved.
    </Text>

    <Text fontSize="sm" {...props}>
      Contact : support@tangobox.app
    </Text>
  </>
)
