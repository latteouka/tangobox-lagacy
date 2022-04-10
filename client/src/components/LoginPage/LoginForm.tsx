import {
  Text,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import React, { useContext } from 'react'
import NextLink from 'next/link'
import axios from 'axios'
import { errorMap } from '../../utils/errorMap'
import { useRouter } from 'next/dist/client/router'
import { UserContext } from '../../utils/UserContext'

export const LoginForm = () => {
  const router = useRouter()
  const toast = useToast()
  const { setUser } = useContext(UserContext)

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values, { setErrors }) => {
        const response = await axios.post(
          `${process.env.API_URL}/user/login`,
          {
            content: {
              email: values.email,
              password: values.password,
            },
          },
          { withCredentials: true }
        )
        if (response.data.error) {
          return setErrors(errorMap(response.data.error))
        }
        toast({
          title: `登入成功`,
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        })
        setUser(response.data.user)
        router.push('/')
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
                  <Flex>
                    <FormLabel htmlFor="password">密碼</FormLabel>
                    <Spacer />
                    <NextLink href="/forget">
                      <Text color="blue.400" cursor="pointer">
                        忘記密碼？
                      </Text>
                    </NextLink>
                  </Flex>
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
