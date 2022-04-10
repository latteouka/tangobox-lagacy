import { Text, Center, Flex, Spinner } from '@chakra-ui/react'
import React from 'react'

interface LoadingProps {
  message: string
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <Flex w="100%" h="91vh">
      <Center w="100%" flexDir="column">
        <Text>{message}</Text>
        <Spinner mt="3" />
      </Center>
    </Flex>
  )
}

export default Loading
