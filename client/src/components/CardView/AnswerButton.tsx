import { Text, Center, Flex } from '@chakra-ui/react'
import React from 'react'

interface AnswerButtonProps {
  answer: (answer: string) => void
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ answer }) => {
  return (
    <Flex alignItems="center">
      <Center
        borderRadius="xl"
        mx={['3', '4', '5', '5']}
        py={['2', '3', '4', '4']}
        w="46%"
        bgColor="red.50"
        _hover={{ backgroundColor: '#FFECEC' }}
        onClick={() => answer('forget')}
      >
        <Text color="gray.600">不記得</Text>
      </Center>
      <Center
        borderRadius="xl"
        mx={['3', '4', '5', '5']}
        py={['2', '3', '4', '4']}
        w="46%"
        bgColor="green.50"
        _hover={{ backgroundColor: '#DFFFDF' }}
        onClick={() => answer('remember')}
      >
        <Text color="gray.600">記得</Text>
      </Center>
    </Flex>
  )
}

export default AnswerButton
