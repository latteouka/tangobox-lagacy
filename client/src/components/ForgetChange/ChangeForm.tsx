import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/dist/client/router'
import * as React from 'react'

export const ChangeForm = () => {
  const toast = useToast()
  const router = useRouter()
  const token = router.query.token as string
  return (
    <Formik
      initialValues={{ newPassword: '', password2: '' }}
      validate={(values) => {
        const errors = {}
        if (
          values.password2 !== '' &&
          values.newPassword !== values.password2
        ) {
          errors['newPassword'] = '兩次密碼輸入不相符'
          return errors
        }
      }}
      onSubmit={async (values) => {
        const response = await axios.post(
          `${process.env.API_URL}/user/change`,
          {
            content: {
              token,
              newPassword: values.newPassword,
            },
          },
          { withCredentials: true }
        )
        if (response.data.error) {
          toast({
            title: `${response.data.error.message}`,
            status: 'error',
            duration: 5000,
            position: 'bottom-right',
            isClosable: true,
          })
        }
        toast({
          title: '密碼設定完成囉，請重新登入',
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        })
        router.push('/login')
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <Stack spacing="3">
            <Field name="newPassword">
              {({ field, form }) => (
                <FormControl
                  name="newPassword"
                  isInvalid={
                    form.errors.newPassword && form.touched.newPassword
                  }
                >
                  <FormLabel htmlFor="newPassword">新密碼</FormLabel>
                  <Input
                    value={values.newPassword}
                    id="newPassword"
                    type="password"
                    required
                    {...field}
                  />
                  <FormErrorMessage>{form.errors.newPassword}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password2">
              {({ field, form }) => (
                <FormControl
                  name="password2"
                  isInvalid={form.errors.password2 && form.touched.password2}
                >
                  <FormLabel htmlFor="password2">確認密碼</FormLabel>
                  <Input
                    value={values.password2}
                    id="password2"
                    type="password"
                    required
                    {...field}
                  />
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
