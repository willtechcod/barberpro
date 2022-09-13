import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import {extendTheme} from '@chakra-ui/react'

import {AuthProvider} from '../context/AuthContext';

const colors = {
  barber:{
    900: '#12131b',
    400: '#1b1c29',
    100: '#c6c6c6'
  },
  button:{
    cta: '#FE0000',
    default:'#FFF',
    gray:'#DFDFDF',
    danger: '#FF4040',
  },
  red:{
    900: '#fe0000'
  }
}

const theme = extendTheme({colors})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider> 
  )
}

export default MyApp
