import React from 'react'
import { RegisterPage } from '../components/RegisterPage'
import WrapperU from '../components/WrapperU'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
  return (
    <WrapperU>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.RECAPTCHA}
        scriptProps={{ async: true, defer: true, appendTo: 'body' }}
      >
        <RegisterPage />
      </GoogleReCaptchaProvider>
    </WrapperU>
  )
}

export default register
