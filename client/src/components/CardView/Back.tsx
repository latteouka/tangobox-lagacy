import React from 'react'
import { Text, Box, Flex } from '@chakra-ui/react'
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
  margin: 0em 0.1em;
  padding-top: 0.7em;
  padding-bottom: 0.2em;
  opacity: 0.9;
`
const MyKanjiText = styled(ReactFuri.Text)`
  word-break: break-all;
`

const fontSizeTitle = {
  base: '1.6rem',
  sm: '2.8rem',
  md: '2.8rem',
  lg: '2.8rem',
  xl: '2.8rem',
}
const fontSizeMeaning = {
  base: '1.1rem',
  sm: '1.8rem',
  md: '1.8rem',
  lg: '1.8rem',
  xl: '1.8rem',
}
const fontSizeSentence = {
  base: '1rem',
  sm: '1.7rem',
  md: '1.7rem',
  lg: '1.7rem',
  xl: '1.7rem',
}

const fontSizeImi = {
  base: '1rem',
  sm: '1.4rem',
  md: '1.4rem',
  lg: '1.4rem',
  xl: '1.4rem',
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
      <Flex fontWeight="bold" textAlign="center">
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
      <Flex
        fontSize={fontSizeMeaning}
        mt="7"
        px={['2', '4', '10', '10']}
        flexDir="column"
        w="100%"
      >
        {tw.map((meaning, index) => {
          return (
            <Flex key={index}>
              <Box>🔅 {meaning}</Box>
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default Back
