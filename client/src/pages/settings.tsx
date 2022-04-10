import axios from 'axios'
import { useContext } from 'react'
import Settings from '../components/Settings'
import Wrapper from '../components/Wrapper'
import { UserContext } from '../utils/UserContext'

const settings: React.FC = () => {
  const { user, setUser } = useContext(UserContext)

  const validate = async () => {
    axios
      .get(`${process.env.API_URL}/user/valid`, {
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
  return <Wrapper>{user && <Settings />}</Wrapper>
}

export default settings
