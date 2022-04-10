import { Center, Flex, Icon } from '@chakra-ui/react'
import { FaTimes, FaCheck } from 'react-icons/fa'
import React, { useContext } from 'react'
import { PageContext } from '../../../utils/PageContext'

interface AnswerButtonProps {}

const AnswerButton: React.FC<AnswerButtonProps> = ({}) => {
  const { page, setPage } = useContext(PageContext)
  return (
    <Flex alignItems="center">
      <Center
        borderRadius="xl"
        mx={['2', '4', '5', '5']}
        py={['2', '3', '4', '4']}
        w="46%"
        bgColor="red.50"
        _hover={{ backgroundColor: '#FFECEC' }}
        onClick={() => setPage(page > 1 ? page - 1 : page)}
      >
        <Icon
          as={FaTimes}
          w={['3', '4', '4', '4']}
          h={['3', '4', '4', '4']}
          color="gray.600"
        />
      </Center>
      <Center
        borderRadius="xl"
        mx={['2', '4', '5', '5']}
        py={['2', '3', '4', '4']}
        w="46%"
        bgColor="green.50"
        _hover={{ backgroundColor: '#DFFFDF' }}
        onClick={() => setPage(page < 4 ? page + 1 : page)}
      >
        <Icon
          as={FaCheck}
          w={['3', '4', '4', '4']}
          h={['3', '4', '4', '4']}
          color="gray.600"
        />
      </Center>
    </Flex>
  )
}

export default AnswerButton
