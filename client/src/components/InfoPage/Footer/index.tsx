import { Box, Spacer, Stack } from '@chakra-ui/react'
import * as React from 'react'
import { Copyright } from './Copyright'
import { SocialMediaLinks } from './SocialMediaLinks'

const App = () => (
  <Box
    as="footer"
    role="contentinfo"
    mx="auto"
    maxW="7xl"
    py="12"
    px={{ base: '4', md: '8' }}
  >
    <Stack>
      <Stack direction="row" spacing="4" align="center" justify="space-between">
        <Spacer />
        <SocialMediaLinks />
        <Spacer />
      </Stack>
      <Copyright alignSelf={{ base: 'center', sm: 'center' }} />
    </Stack>
  </Box>
)
export default App
