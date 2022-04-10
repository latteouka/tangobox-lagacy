import {
  Box,
  Button,
  Heading,
  Link,
  SimpleGrid,
  Text,
  useToast,
  VisuallyHidden,
} from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import React, { useContext, useState } from 'react'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { Card } from './Card'
import { DividerWithText } from './DividerWithText'
import { LoginForm } from './LoginForm'
import axios from 'axios'
import { UserContext } from '../../utils/UserContext'

export const LoginPage = () => {
  const { setUser } = useContext(UserContext)
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isDisable, setIsDisable] = useState(false)

  const responseFacebook = async (response: any) => {
    setIsLoading(true)
    setIsDisable(true)
    console.log(response)
    if (response.status === 'unknown') {
      router.push('/login')
    }
    if (response.email) {
      const { email, accessToken, id } = response

      const facebookAuth = await axios.post(
        `${process.env.API_URL}/user/facebook`,
        {
          content: {
            token: accessToken,
            id,
            email,
          },
        },
        { withCredentials: true }
      )
      setUser(facebookAuth.data.user)
      toast({
        title: '以Facebook登入成功',
        status: 'success',
        duration: 4000,
        position: 'bottom-right',
        isClosable: true,
      })
      setIsLoading(false)
      setIsDisable(false)
      router.push('/settings')
    }
  }
  const responseGoogle = async (response: any) => {
    setIsLoading2(true)
    setIsDisable(true)
    console.log(response)
    if (response) {
      const googleAuth = await axios.post(
        `${process.env.API_URL}/user/google`,
        {
          content: {
            email: response.profileObj.email,
            token: response.tokenId,
          },
        },
        { withCredentials: true }
      )
      setUser(googleAuth.data.user)
      toast({
        title: '以Google登入成功',
        status: 'success',
        duration: 4000,
        position: 'bottom-right',
        isClosable: true,
      })
      setIsLoading2(false)
      setIsDisable(false)
      router.push('/settings')
    }
  }
  const responseGoogleFailed = () => {}

  return (
    <Box py="12" px={{ base: '12', lg: '12' }}>
      <Box maxW="md" mx="auto">
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          登入
        </Heading>
        <Text mt="4" mb="4" align="center" maxW="md" fontWeight="medium">
          還沒有帳號嗎？
          <Link href="/register">
            <Text as="span" color="blue.400" cursor="pointer">
              註冊
            </Text>
          </Link>
        </Text>
        <Card>
          <LoginForm />
          <DividerWithText mt="6">或者</DividerWithText>
          <SimpleGrid mt="6" columns={2} spacing="3">
            <FacebookLogin
              appId={process.env.FACEBOOK_TOKEN}
              callback={responseFacebook}
              disableMobileRedirect={true}
              fields="email"
              render={(renderProps: any) => (
                <Button
                  onClick={renderProps.onClick}
                  color="currentColor"
                  isLoading={isLoading}
                  isDisabled={isDisable}
                  variant="outline"
                >
                  <VisuallyHidden>Login with Facebook</VisuallyHidden>
                  <FaFacebook />
                </Button>
              )}
            />
            <GoogleLogin
              clientId={process.env.GOOGLE_TOKEN}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  color="currentColor"
                  isLoading={isLoading2}
                  isDisabled={isDisable}
                  variant="outline"
                >
                  <VisuallyHidden>Login with Google</VisuallyHidden>
                  <FaGoogle />
                </Button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogleFailed}
              cookiePolicy={'single_host_origin'}
            />
          </SimpleGrid>
        </Card>
      </Box>
    </Box>
  )
}
