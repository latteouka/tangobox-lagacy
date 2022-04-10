import {
  chakra,
  HTMLChakraProps,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'
import * as React from 'react'

export const Logo = (props: HTMLChakraProps<'svg'>) => {
  const [white, black] = useToken('colors', ['white', 'gray.800'])
  return (
    <chakra.svg
      color={useColorModeValue('blue.500', 'blue.300')}
      aria-hidden
      viewBox="0 0 123 24"
      fill="none"
      h="6"
      flexShrink={0}
      {...props}
    >
      <path
        d="M23 0H7a1 1 0 00-1 1v16H3c-1.654 0-3 1.346-3 3v4h14v-3.583c0-.808.645-1.417 1.5-1.417.723 0 1.5.47 1.5 1.5 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5V1a1 1 0 00-1-1zM12 20.417V22H2v-2a1 1 0 011-1h9.304c-.196.43-.304.909-.304 1.417zM20 13H10v-2h10v2zm0-6H10V5h10v2z"
        fill="currentColor"
      />
    </chakra.svg>
  )
}
