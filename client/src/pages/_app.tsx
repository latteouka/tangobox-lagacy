import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/kiwi-maru/300.css";
import "@fontsource/kiwi-maru/400.css";
import "@fontsource/kiwi-maru/500.css";

import theme from "../theme";
import { AppProps } from "next/app";

import { UserContext } from "../utils/UserContext";
import { PageContext } from "../utils/PageContext";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  return (
    <PageContext.Provider value={{ page, setPage }}>
      <UserContext.Provider value={{ user, setUser }}>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </UserContext.Provider>
    </PageContext.Provider>
  );
}

export default MyApp;
