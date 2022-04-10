import React from 'react'
import { ForgetPassword } from '../../components/ForgetPassword'
import WrapperU from '../../components/WrapperU'

interface ForgetProps {}

const Forget: React.FC<ForgetProps> = ({}) => {
  return (
    <WrapperU>
      <ForgetPassword />
    </WrapperU>
  )
}

export default Forget
