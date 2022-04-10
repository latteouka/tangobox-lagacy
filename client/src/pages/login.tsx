import React from 'react'
import { LoginPage } from '../components/LoginPage'
import Wrapper from '../components/Wrapper'

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  return (
    <Wrapper>
      <LoginPage />
    </Wrapper>
  )
}

export default login
