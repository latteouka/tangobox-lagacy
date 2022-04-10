import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/dist/client/router'
import * as React from 'react'

export const ForgetForm = () => {
  const toast = useToast()
  const router = useRouter()
  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        const response = await axios.post(
          `${process.env.API_URL}/user/forget`,
          { content: { email: values.email } },
          { withCredentials: true }
        )
        console.log(response)
        toast({
          title: `已寄送重置密碼信件給你囉！`,
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
