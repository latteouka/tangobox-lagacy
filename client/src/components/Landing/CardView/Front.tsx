import React from 'react'
import { Center, Flex, Heading, Text, Tooltip } from '@chakra-ui/react'

interface FrontProps {
  tango: string
}

const Front: React.FC<FrontProps> = ({ tango }) => {
  return (
    <Flex flexDir="column" h="100%">
      <Heading mt="5" size="md" fontFamily="Kiwi Maru">
        How to use
      </Heading>
      <Center h="100%">
        <Tooltip
          hasArrow
          label="認得或記得？（回答後看解答）"
          isOpen
          bg="gray"
          placement="top"
        >
          <Text
            fontSize={{
              base: '40px',
              sm: '50px',
              md: '60px',
              lg: '70px',
              xl: '70px',
            }}
            color="blackAlpha"
            fontFamily="Kiwi Maru"
          >
            {tango}
          </Text>
        </Tooltip>
      </Center>
    </Flex>
  )
}

export default Front
