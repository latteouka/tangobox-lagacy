import { FaVolumeUp, FaArrowRight } from 'react-icons/fa'
import { Center, Flex, Icon, Spacer, Tooltip } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { PageContext } from '../../../utils/PageContext'

interface NextButtonProps {
  replay: () => void
}

const NextButton: React.FC<NextButtonProps> = ({ replay }) => {
  const { setPage } = useContext(PageContext)
  return (
    <Flex alignItems="center">
      <Tooltip hasArrow label="再聽一次" isOpen bg="gray" placement="top">
        <Center
          borderRadius="xl"
          mx={['3', '4', '5', '5']}
          py={['3', '3', '4', '4']}
          w="12"
          _hover={{ backgroundColor: '#F0F0F0' }}
          onClick={() => replay()}
        >
          <Icon
            as={FaVolumeUp}
            w={['3', '4', '4', '4']}
            h={['3', '4', '4', '4']}
            color="gray"
          />
        </Center>
      </Tooltip>
      <Spacer />
      <Tooltip hasArrow label="下一張" isOpen bg="gray" placement="top">
        <Center
          borderRadius="xl"
          mx={['3', '4', '5', '5']}
          py={['3', '3', '4', '4']}
          w="30%"
          bgColor="gray.50"
          _hover={{ backgroundColor: '#F0F0F0' }}
          onClick={() => setPage(1)}
        >
          <Icon
            as={FaArrowRight}
            w={['3', '4', '4', '4']}
            h={['3', '4', '4', '4']}
            color="gray.600"
          />
        </Center>
      </Tooltip>
      <Spacer />
      <Center
        borderRadius="xl"
        mx={['3', '4', '5', '5']}
        py={['3', '3', '4', '4']}
        w="12"
      ></Center>
    </Flex>
  )
}

export default NextButton
