import { Flex } from '@chakra-ui/layout'
import { FiBox } from 'react-icons/fi'
import {
  Box,
  Center,
  Heading,
  Icon,
  Spacer,
  useColorMode,
  useToast,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React, { useContext } from 'react'
import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/dist/client/router'
import { UserContext } from '../../utils/UserContext'
import axios from 'axios'
import Cookies from 'js-cookie'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, setUser } = useContext(UserContext)

  const router = useRouter()
  const toast = useToast()

  const logoutHandler = async () => {
    axios
      .get(`${process.env.API_URL}/user/logout`, {
        withCredentials: true,
      })
      .then(() => {
        setUser(null)
        Cookies.remove('newCards50', { path: '' })
        Cookies.remove('reviewCards50', { path: '' })
        Cookies.remove('newCards', { path: '' })
        Cookies.remove('reviewCards', { path: '' })
        toast({
          title: `已成功登出`,
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        })
        router.push('/')
      })
  }

  return (
    <Box>
      <Flex
        px={['3', '3', '8', '8']}
        py={['6', '6', '6', '6']}
        h={['6vh', '6vh', '8vh', '8vh']}
        maxW="1300px"
        mx="auto"
      >
        <NextLink href="/">
          <Flex>
            <Center ml="2">
              <Heading
                fontFamily="Kiwi Maru"
                fontSize={{ base: '20px', sm: '25px', md: '30px', lg: '35px' }}
                _hover={{
                  cursor: 'pointer',
                }}
              >
                TangoBox
              </Heading>
            </Center>
          </Flex>
        </NextLink>
        <Spacer />
        <Center>
          <Center
            _hover={
              colorMode === 'light'
                ? { backgroundColor: '#F0F0F0' }
                : { backgroundColor: '#3C3C3C' }
            }
            h="8"
            w="8"
            borderRadius="md"
            onClick={toggleColorMode}
            mr={[2, 2, 2, 3]}
            color="gray"
          >
            {colorMode === 'light' && <MoonIcon />}
            {colorMode === 'dark' && <SunIcon />}
          </Center>
          {user && (
            <>
              <NextLink href="/settings">
                <Center
                  _hover={
                    colorMode === 'light'
                      ? { backgroundColor: '#F0F0F0' }
                      : { backgroundColor: '#3C3C3C' }
                  }
                  h="8"
                  w="8"
                  borderRadius="md"
                  mr={[2, 2, 2, 3]}
                >
                  <SettingsIcon color="gray.600" />
                </Center>
              </NextLink>
              <Box
                px={[2, 2, 3, 3]}
                py={[0, 1, 2, 2]}
                borderRadius="md"
                borderWidth="1px"
                fontSize={['sm', 'sm', 'md', 'md']}
                onClick={logoutHandler}
                cursor="pointer"
              >
                登出
              </Box>
            </>
          )}
          {!user && (
            <NextLink href="/login">
              <Box
                px={[2, 2, 3, 3]}
                py={[0, 1, 2, 2]}
                borderRadius="md"
                borderWidth="1px"
                fontSize={['sm', 'sm', 'md', 'md']}
                cursor="pointer"
              >
                登入
              </Box>
            </NextLink>
          )}
        </Center>
      </Flex>
    </Box>
  )
}

export default Navbar
