import axios from 'axios'
import React, { useContext } from 'react'
import Boxes from '../components/Boxes'
import Wrapper from '../components/Wrapper'
import { UserContext } from '../utils/UserContext'

const BoxesView = () => {
  const { user, setUser } = useContext(UserContext)

  const validate = async () => {
    axios
      .get('http://localhost:4000/user/valid', {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (!user) {
    validate()
  }
  return <Wrapper>{user && <Boxes user={user} />}</Wrapper>
}
export default BoxesView
