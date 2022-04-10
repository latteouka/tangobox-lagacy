import { Button, Text, Center, Heading, Flex, Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { UserContext } from '../../../utils/UserContext'
import NextLink from 'next/link'

interface CardViewProps {}

const CardView: React.FC<CardViewProps> = ({}) => {
  const { user } = useContext(UserContext)
  return (
    <Flex
      maxW="1200px"
      w={['100%', '100%', '100%', '100%']}
      flexDir="column"
      mt="5"
    >
      <Center mb="2">
        <Heading size="md">単語ボックス</Heading>
      </Center>
      <Flex lineHeight="1.8rem" p="3" mx="4" flexDir="column">
        <Heading size="sm" my="2">
          間隔重複
        </Heading>
        早期關於遺忘曲線及間隔重複的研究，就是將要背誦的內容製成卡片，依照記憶情形決定是否放入下一個箱子內（括號內為下次複習時間）。你可以如此想像：
        <Flex
          borderWidth="1px"
          borderColor="gray.300"
          w="100%"
          my="3"
          borderRadius="md"
          textAlign="center"
          fontSize=".8rem"
        >
          <Flex
            justifyContent="center"
            borderRight="1px"
            borderColor="gray.300"
            w="7%"
            alignItems="center"
            h="50px"
          >
            1
          </Flex>
          <Flex
            justifyContent="center"
            borderRight="1px"
            borderColor="gray.300"
            w="10%"
            alignItems="center"
            h="50px"
          >
            2(2)
          </Flex>
          <Flex
            justifyContent="center"
            borderRight="1px"
            borderColor="gray.300"
            w="15%"
            alignItems="center"
            h="50px"
          >
            3(3)
          </Flex>
          <Flex
            justifyContent="center"
            borderRight="1px"
            borderColor="gray.300"
            w="20%"
            alignItems="center"
            h="50px"
          >
            4(5)
          </Flex>
          <Flex
            justifyContent="center"
            borderRight="1px"
            borderColor="gray.300"
            w="25%"
            alignItems="center"
            h="50px"
          >
            5(8)
          </Flex>
          <Flex
            justifyContent="center"
            borderRight="1px"
            borderColor="gray.300"
            w="30%"
            alignItems="center"
            h="50px"
          >
            6(13)
          </Flex>
          <Flex
            justifyContent="center"
            borderColor="gray.300"
            w="60%"
            alignItems="center"
            h="50px"
          >
            7(21)
          </Flex>
        </Flex>
        （在1裡面的卡片，記得的話就放入2，以此類推，但若忘記了就重新放回1，越後面的箱子，再次複習的時間越長）
        最有效率的記憶甜蜜點就在於快要忘記或是剛忘記時，用間隔重複可以讓字卡有效率地趕快進入長期記憶，記憶狀況良好的卡片也因為很快就到後方的箱子內，不必馬上複習。
      </Flex>
      <Flex lineHeight="1.8rem" p="3" mx="4" flexDir="column">
        <Heading size="sm" my="2">
          使用方式
        </Heading>
        Tangobox需要「每天使用一次」把新單字記憶完＋把舊單字複習完，在看到單字後，向自己內心確認是否「記得」或「認得（這個字對你來說本來就不是生字）」，Tangobox會處理後面的間隔重複機制。
        <Text color="red.500" my="1">
          🔅 用一杯咖啡的價格
          <Text fontWeight="bold" as="a" href={user ? '/settings' : '/login'}>
            加入訂閱
          </Text>
          （60元/月），每月都會有新的字卡加入，一天背3張新卡片，週末不背新單字。
        </Text>
        <Text color="red.500" my="1">
          🔅
          堅持每天做完功課很重要，看過的卡片多了後，光是間隔到期的卡片要複習就會花上不少時間。若好幾天沒使用，雖然沒有新單字加入，但到期的複習卡片也會不斷累積。
        </Text>
        <Text color="red.500" my="1">
          🔅 畢業單字表示「下次複習大於30天」的單字（不太可能忘記了）。
        </Text>
        <Center mt="5">
          <NextLink href={user ? '/review' : '/login'}>
            <Button size="sm" colorScheme="teal" mx="2">
              前往複習
            </Button>
          </NextLink>
        </Center>
      </Flex>
    </Flex>
  )
}

export default CardView
