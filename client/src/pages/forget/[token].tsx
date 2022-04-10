import React from 'react'
import Wrapper from '../../components/Wrapper'
import { ChangePassword } from '../../components/ForgetChange'

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  return (
    <Wrapper>
      <ChangePassword />
    </Wrapper>
  )
}

export default ForgotPassword
