import {
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import axios from 'axios'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/dist/client/router'
import React, { useCallback, useEffect, useState } from 'react'
import { errorMap } from '../../utils/errorMap'
import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export const RegisterForm = () => {
  const [token, setToken] = useState('')
  const [recapLoading, setRecapLoading] = useState(true)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const router = useRouter()
  const toast = useToast()

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return
    }
    const token = await executeRecaptcha('signup')
    setToken(token)
    setRecapLoading(false)
  }, [executeRecaptcha])

  useEffect(() => {
    handleReCaptchaVerify()
  }, [])

  return (
    <Formik
      initialValues={{ email: '', password: '', password2: '' }}
      validate={(values) => {
        const errors = {}
        if (values.password2 !== '' && values.password !== values.password2) {
          errors['password'] = '兩次密碼輸入不相符'
          return errors
        }
      }}
      onSubmit={async (values, { setErrors }) => {
        const response = await axios.post(
          `${process.env.API_URL}/user/register`,
          {
            content: {
              email: values.email,
              password: values.password,
              token,
            },
          },
          { withCredentials: true }
        )
        if (response.data.error) {
          return setErrors(errorMap(response.data.error))
        }
        toast({
          title: `註冊完成，順便幫你登入囉`,
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        })
        router.push('/settings')
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <Stack spacing="3">
            <Field name="email">
              {({ field, form }) => (
                <FormControl
                  name="email"
                  isInvalid={form.errors.email && form.touched.email}
                >
                  <FormLabel htmlFor="email">電子信箱</FormLabel>
                  <Input
                    value={values.email}
                    id="email"
                    type="email"
                    required
                    {...field}
                  />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }) => (
                <FormControl
                  name="password"
                  isInvalid={form.errors.password && form.touched.password}
                >
                  <FormLabel htmlFor="password">密碼</FormLabel>
                  <Input
                    value={values.password}
                    id="password"
                    type="password"
                    required
                    {...field}
                  />
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password2">
              {({ field, form }) => (
                <FormControl
                  name="password2"
                  isInvalid={form.errors.password && form.touched.password}
                >
                  <FormLabel htmlFor="password">確認密碼</FormLabel>
                  <Input
                    value={values.password2}
                    id="password2"
                    type="password"
                    required
                    {...field}
                  />
                  <FormErrorMessage>{form.errors.password2}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            {recapLoading && (
              <Text color="red.400">
                <Spinner size="xs" mr="2" />
                reCaptcha驗證中...
              </Text>
            )}
            <GoogleReCaptcha action="signup" onVerify={handleReCaptchaVerify} />
            <Button
              isLoading={isSubmitting}
              type="submit"
              colorScheme="gray"
              size="md"
              fontSize="md"
            >
              送出
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
