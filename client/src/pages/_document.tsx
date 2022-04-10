import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <head>
          <meta
            name="description"
            content="Spaced repetition app for Japanese learning. 用間隔重複記憶來學習日文吧！"
          />
          <meta property="og:image" content="/meta.png" />
          <title>TangoBox</title>
        </head>
        <Head />
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
