import { Box, Heading } from '@chakra-ui/react'
import * as React from 'react'
import { Card } from './Card'
import { ForgetForm } from './ForgetForm'

export const ForgetPassword = () => {
  return (
    <Box py="12" px={{ base: '12', lg: '12' }}>
      <Box maxW="md" mx="auto">
        <Heading mb="4" textAlign="center" size="xl" fontWeight="extrabold">
          忘記密碼
        </Heading>
        <Card>
          <ForgetForm />
        </Card>
      </Box>
    </Box>
  )
}
