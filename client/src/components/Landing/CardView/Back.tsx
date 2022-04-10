import React from 'react'
import { Text, Box, Flex, Icon, Tooltip } from '@chakra-ui/react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import styled from 'styled-components'
import ReactFuri from 'react-furi'

interface BackProps {
  kotoba: string
  furi: string
  tw: string[]
  rei: string
  reiFuri: string
  reiImi: string
}

const MyWrapper = ReactFuri.Wrapper.withComponent('span')
const MyPair = styled(ReactFuri.Pair)`
  font-size: inherit;
`
const MyFuriText = styled(ReactFuri.Furi)`
  font-family: 'Kiwi Maru';
  margin: 0em 0.1em;
  padding-top: 1.1em;
  padding-bottom: 0.2em;
  opacity: 0.9;
`
const MyKanjiText = styled(ReactFuri.Text)`
  font-family: 'Kiwi Maru';
`

const fontSizeTitle = {
  base: '2.2rem',
  sm: '3.5rem',
  md: '3.8rem',
  lg: '4rem',
  xl: '4rem',
}
const fontSizeMeaning = {
  base: '1.4rem',
  sm: '1.8rem',
  md: '2rem',
  lg: '2.1rem',
  xl: '2.3rem',
}
const fontSizeSentence = {
  base: '1.4rem',
  sm: '1.7rem',
  md: '1.9rem',
  lg: '2rem',
  xl: '2.2rem',
}

const fontSizeImi = {
  base: '1.2rem',
  sm: '1.3rem',
  md: '1.5rem',
  lg: '1.7rem',
  xl: '1.8rem',
}

const Back: React.FC<BackProps> = ({
  kotoba,
  furi,
  tw,
  rei,
  reiFuri,
  reiImi,
}) => {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      h="100%"
      fontSize={fontSizeTitle}
      color="blackAlpha"
      px={['6', '8', '10', '10']}
    >
      <Tooltip hasArrow label="單字" isOpen bg="gray" placement="top">
        <Flex textAlign="center">
          <ReactFuri
            word={kotoba}
            reading={furi}
            render={({ pairs }) => (
              <MyWrapper lang="ja">
                {pairs.map(([furigana, text], index: number) => (
                  <MyPair key={index}>
                    <MyFuriText>{furigana}</MyFuriText>
                    <MyKanjiText>{text}</MyKanjiText>
                  </MyPair>
                ))}
              </MyWrapper>
            )}
          />
        </Flex>
      </Tooltip>
      <Tooltip hasArrow label="意思" isOpen bg="gray" placement="left">
        <Flex
          fontSize={fontSizeMeaning}
          my={['3', '4', '4', '4']}
          mx={['4', '4', '6', '6']}
          flexDir="column"
          w="90%"
          fontFamily="Kiwi Maru"
        >
          {tw.map((meaning, index) => {
            return (
              <Flex key={index}>
                <Box color="gray" w="10%">
                  <Icon as={MdKeyboardArrowRight} color="gray.500" />
                </Box>
                <Box w="90%">{meaning}</Box>
              </Flex>
            )
          })}
        </Flex>
      </Tooltip>

      <Tooltip hasArrow label="例句" isOpen bg="gray" placement="top">
        <Flex flexDir="column">
          <Text
            fontSize={fontSizeSentence}
            color="gray"
            style={{
              wordWrap: 'break-word',
            }}
          >
            <ReactFuri
              word={rei}
              reading={reiFuri}
              render={({ pairs }) => (
                <MyWrapper lang="ja">
                  {pairs.map(([furigana, text], index: number) => {
                    return (
                      <MyPair key={index}>
                        <MyFuriText>{furigana}</MyFuriText>
                        <MyKanjiText>{text}</MyKanjiText>
                      </MyPair>
                    )
                  })}
                </MyWrapper>
              )}
            />
          </Text>
          <Text
            mt="3"
            fontSize={fontSizeImi}
            color="gray"
            style={{
              wordWrap: 'break-word',
            }}
          >
            {reiImi}
          </Text>
        </Flex>
      </Tooltip>
      <Text
        fontSize={['.8rem', '.8rem', '1rem', '1rem']}
        color="red.500"
        mt={['3', '3', '5', '5']}
      >
        📍 TangoBox會計算下次複習時間。
      </Text>
      <Text fontSize={['.8rem', '.8rem', '1rem', '1rem']} color="red.500">
        📍 每天背完新單字，複習到期舊單字。
      </Text>
      <Text fontSize={['.8rem', '.8rem', '1rem', '1rem']} color="red.500">
        📍 每月新增30張卡片，一天背5張新卡片。
      </Text>
    </Flex>
  )
}

export default Back
