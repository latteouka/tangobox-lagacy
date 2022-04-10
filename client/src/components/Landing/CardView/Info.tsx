import React, { useContext } from 'react'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { UserContext } from '../../../utils/UserContext'

const Info: React.FC = () => {
  const { user } = useContext(UserContext)
  return (
    <Flex
      flexDir="column"
      h="100%"
      fontSize={['.8rem', '.8rem', '1rem', '1rem']}
    >
      <Heading mt="5" size="md" fontFamily="Kiwi Maru">
        About
      </Heading>
      <Flex flexDir="column" p={['3', '5', '8', '8']} textAlign="left">
        <Flex flexDir="column" h="80%">
          <Text>每天刷一次單字，一起變強吧！</Text>
          <Text mt="2">📝 字卡是從日劇、動畫中「對話」筆記下來</Text>
          <Text mt="2">🔅 週末休息不背新單字</Text>
          <Text mt="2">🔖 Google或Facebook登入可直接註冊</Text>
          <Text mt="2">🗓 註冊完可以試用一個月</Text>
        </Flex>

        <Flex mt="2" p="2" h="20%" justifyContent="center">
          <NextLink href="/info">
            <Button size="sm" colorScheme="gray" mx="2">
              瞭解更多
            </Button>
          </NextLink>
          <NextLink href={user ? '/review' : '/login'}>
            <Button size="sm" colorScheme="teal" mx="2">
              前往複習
            </Button>
          </NextLink>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Info
