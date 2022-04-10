import { Box, Text, Center, Flex } from '@chakra-ui/react'
import React from 'react'

interface StatusProps {}

const Status: React.FC<StatusProps> = ({}) => {
  return (
    <Flex flexDir="column">
      <Center h="10%" mx="auto" p="5">
        <Text>Chun @ N5 Box</Text>
      </Center>
      <Flex h="80%">2</Flex>
      <Flex h="10%">3</Flex>
    </Flex>
  )
}

export default Status
