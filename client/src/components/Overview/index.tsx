import { Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

interface OverviewProps {}

const Overview: React.FC<OverviewProps> = ({}) => {
  return (
    <Flex flexDir={['column', 'column', 'row', 'row']}>
      <Flex
        w={[null, '100%', '25%', '30%']}
        h={['12vh', '12vh', '91vh', '91vh']}
        justify="true"
        overflow="hidden"
        color="blackAlpha"
      >
        <Flex flexDir="column">
          <NextLink href="/review">
            <Link>review link</Link>
          </NextLink>
          <NextLink href="/login">
            <Link>login link</Link>
          </NextLink>
          <NextLink href="/register">
            <Link>register link</Link>
          </NextLink>
          <NextLink href="/forget">
            <Link>forget link</Link>
          </NextLink>
        </Flex>
      </Flex>
      <Flex
        w={['100%', '100%', '50%', '40%']}
        h={['70vh', '70vh', '91vh', '91vh']}
        bgColor="red.50"
      >
        2
      </Flex>
      <Flex
        w={['100%', '100%', '25%', '30%']}
        h={['12vh', '12vh', '91vh', '91vh']}
        bgColor="teal.50"
      >
        3
      </Flex>
    </Flex>
  )
}

export default Overview
