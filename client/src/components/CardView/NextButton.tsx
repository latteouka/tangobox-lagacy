import { FaArrowRight } from 'react-icons/fa'
import { Center, Flex, Icon, Spacer } from '@chakra-ui/react'
import React from 'react'

interface NextButtonProps {
  next: () => void
}

const NextButton: React.FC<NextButtonProps> = ({ next }) => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Center
        borderRadius="xl"
        mx={['3', '4', '5', '5']}
        py={['3', '3', '4', '4']}
        w="30%"
        bgColor="gray.50"
        _hover={{ backgroundColor: '#F0F0F0' }}
        onClick={() => next()}
      >
        <Icon
          as={FaArrowRight}
          w={['3', '4', '4', '4']}
          h={['3', '4', '4', '4']}
          color="gray.600"
        />
      </Center>
    </Flex>
  )
}

export default NextButton
