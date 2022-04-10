import React, { useContext, useEffect, useState } from 'react'
import { Center, Flex, Progress, Text } from '@chakra-ui/react'
import { encode } from 'hex-encode-decode'
import { UserContext } from '../../utils/UserContext'
import PouchDB from 'pouchdb'

interface FinishProps {}

const Finish: React.FC<FinishProps> = ({}) => {
  const { user } = useContext(UserContext)
  const dbName = `userdb-${encode(user.uuid)}`
  const client = new PouchDB(`${dbName}`)

  const [saw, setSaw] = useState(0)
  const [graduate, setGraduate] = useState(0)

  useEffect(() => {
    client
      .find({
        selector: {
          new: false,
        },
      })
      .then((res) => {
        setSaw(res.docs.length)
      })

    client
      .find({
        selector: {
          new: false,
          due: { $gt: new Date(new Date().setDate(new Date().getDate() + 30)) },
        },
      })
      .then((res) => {
        setGraduate(res.docs.length)
      })
  }, [])
  return (
    <Center h="100%" flexDir="column" p="5">
      <Text
        fontSize={{
          base: '2rem',
          sm: '3rem',
          md: '3rem',
          lg: '3rem',
          xl: '3rem',
        }}
        color="blackAlpha"
      >
        終わり
      </Text>
      <Text
        mt="3"
        fontSize={{
          base: '0.9rem',
          sm: '1rem',
          md: '1rem',
          lg: '1rem',
          xl: '1rem',
        }}
        color="blackAlpha"
      >
        看過卡片：{saw}
      </Text>
      <Text
        fontSize={{
          base: '0.9rem',
          sm: '1rem',
          md: '1rem',
          lg: '1rem',
          xl: '1rem',
        }}
        color="blackAlpha"
      >
        畢業卡片：{graduate}
      </Text>
    </Center>
  )
}

export default Finish
