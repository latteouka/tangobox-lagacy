import {
  Text,
  Badge,
  Box,
  Center,
  Heading,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../utils/UserContext'
import data from './data.json'
import modalContent from './modal.json'
import { Stat } from './Stat'
import { StatLabel } from './StatLabel'
import { StatNumber } from './StatNumber'
import NextLink from 'next/link'

const App = ({ user }) => {
  const { setUser } = useContext(UserContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modal, setModal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isLoading3, setIsLoading3] = useState(false)
  const [isLoading4, setIsLoading4] = useState(false)
  const [isDisable, setIsDisable] = useState(false)

  const activateHandler = (cat: string) => {
    setIsLoading4(true)
    setIsDisable(true)
    axios
      .post(
        'http://localhost:4000/box/addbox',
        { content: { cat } },
        { withCredentials: true }
      )
      .then((res) => {
        setUser(res.data.user)
        setIsDisable(false)
        setIsLoading4(false)
        onClose()
      })
      .catch((err) => {
        setIsDisable(false)
        setIsLoading4(false)
        console.log(err)
      })
  }

  const gojyu = (hk: string, cat: string) => {
    setIsDisable(true)
    if (cat === '休閒') {
      setIsLoading(true)
    } else if (cat === '普通') {
      setIsLoading2(true)
    } else if (cat === '激進') {
      setIsLoading3(true)
    }
    let url: string
    if (hk === '五十音 平假名') {
      url = 'http://localhost:4000/box/addbox50h'
    } else if (hk === '五十音 片假名') {
      url = 'http://localhost:4000/box/addbox50k'
    }
    axios
      .post(url, { content: { cat } }, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user)
        setIsDisable(false)
        onClose()
      })
      .catch((err) => {
        setIsDisable(false)
        console.log(err)
      })
  }
  //useEffect(() => {}, [user])
  return (
    <Box as="section" p="10">
      <Center mb="10">
        <Heading>Boxes</Heading>
      </Center>

      {user.active.length > 0 && (
        <Center>
          <Heading size="md" my="5">
            啟用中Box
          </Heading>
        </Center>
      )}
      <Box maxW="7xl" mx="auto" px={{ base: '6', md: '8' }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6">
          {data.map(({ label, value, path }) => {
            if (user.active.includes(label)) {
              if (label === '五十音 平假名' || label === '五十音 片假名') {
                const daily =
                  label === '五十音 平假名'
                    ? user.dailyNew50h
                    : user.dailyNew50k
                return (
                  <NextLink key={label} href={`/review/${path}`}>
                    <Flex>
                      <Stat cursor="pointer">
                        <StatLabel>每日新字：{daily}個</StatLabel>
                        <StatNumber>{label}</StatNumber>
                      </Stat>
                    </Flex>
                  </NextLink>
                )
              }
              return (
                <NextLink key={label} href={`/review/${path}`}>
                  <Flex>
                    <Stat cursor="pointer">
                      <StatLabel>{value}</StatLabel>
                      <StatNumber>{label}</StatNumber>
                    </Stat>
                  </Flex>
                </NextLink>
              )
            }
          })}
        </SimpleGrid>
      </Box>
      {user.active.length < data.length && (
        <Center>
          <Heading size="md" my="5">
            未啟用Box
          </Heading>
        </Center>
      )}
      <Box maxW="7xl" mx="auto" px={{ base: '6', md: '8' }}>
        <SimpleGrid cursor="pointer" columns={{ base: 1, md: 3 }} spacing="6">
          {data.map(({ label, value, free }) => {
            if (!user.active.includes(label))
              return (
                <Stat
                  key={label}
                  onClick={() => {
                    setModal(label)
                    onOpen()
                  }}
                >
                  <StatLabel>{value}</StatLabel>
                  <StatNumber>{label}</StatNumber>
                  {free && (
                    <Badge colorScheme="teal" variant="solid">
                      FREE
                    </Badge>
                  )}
                </Stat>
              )
          })}
        </SimpleGrid>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        {modalContent.map(({ label, button, content }) => {
          if (modal === label) {
            return (
              <ModalContent key={label}>
                <ModalHeader>{label}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex flexDir="column">
                    <Text>確定要啟用 {label} Box？</Text>
                    {content.split('\n').map((item) => {
                      return <Text key={item}>{item}</Text>
                    })}
                  </Flex>
                </ModalBody>

                <ModalFooter>
                  {modal === ('五十音 平假名' || '五十音 片假名') && (
                    <>
                      <Button
                        colorScheme="teal"
                        mr={3}
                        isLoading={isLoading}
                        isDisabled={isDisable}
                        onClick={() => gojyu(modal, '休閒')}
                      >
                        休閒
                      </Button>
                      <Button
                        colorScheme="teal"
                        mr={3}
                        isLoading={isLoading2}
                        isDisabled={isDisable}
                        onClick={() => gojyu(modal, '普通')}
                      >
                        普通
                      </Button>
                      <Button
                        colorScheme="teal"
                        mr={3}
                        isLoading={isLoading3}
                        isDisabled={isDisable}
                        onClick={() => gojyu(modal, '激進')}
                      >
                        激進
                      </Button>
                    </>
                  )}
                  {modal !== ('五十音 平假名' || '五十音 片假名') &&
                    button.map((item, index) => {
                      return (
                        <Button
                          key={index}
                          colorScheme="teal"
                          isLoading={isLoading4}
                          isDisabled={isDisable}
                          mr={3}
                          onClick={() => activateHandler(label)}
                        >
                          {item}
                        </Button>
                      )
                    })}
                </ModalFooter>
              </ModalContent>
            )
          }
        })}
      </Modal>
    </Box>
  )
}
export default App
