import {
  Box,
  Button,
  Heading,
  SimpleGrid,
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
import { RegisterForm } from './RegisterForm'
import axios from 'axios'
import { UserContext } from '../../utils/UserContext'

export const RegisterPage = () => {
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
    if (response.name) {
      const { email, accessToken, id } = response

      const facebookAuth = await axios.post(
        `${process.env.API_URL}/user/facebook`,
        {
          content: {
            token: accessToken,
            id,
            email: email,
          },
        },
        { withCredentials: true }
      )
      setUser(facebookAuth.data.newUser)
      toast({
        title: '以Facebook登入成功',
        status: 'success',
        duration: 4000,
        position: 'bottom-right',
        isClosable: true,
      })
      router.push('/settings')
      setIsLoading(false)
      setIsDisable(false)
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
      setUser(googleAuth.data.newUser)
      toast({
        title: '以Google登入成功',
        status: 'success',
        duration: 4000,
        position: 'bottom-right',
        isClosable: true,
      })
      router.push('/settings')
      setIsLoading2(false)
      setIsDisable(false)
    }
  }
  const responseGoogleFailed = () => {}

  return (
    <Box py="12" px={{ base: '12', lg: '12' }}>
      <Box maxW="md" mx="auto">
        <Heading mb="5" textAlign="center" size="xl" fontWeight="extrabold">
          註冊
        </Heading>
        <Card>
          <RegisterForm />
          <DividerWithText mt="6">或者</DividerWithText>
          <SimpleGrid mt="6" columns={2} spacing="3">
            <FacebookLogin
              appId={process.env.FACEBOOK_TOKEN}
              callback={responseFacebook}
              fields="name,email"
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
