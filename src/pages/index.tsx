import Head from 'next/head'
import {Flex, Text} from '@chakra-ui/react'

export default function Home(){
  return (
    <>
    <Head>
      <link rel="shortcut icon" href="./Icon.png" type="image/x-icon" />
      <title>BarberPro | Seu sistema completo</title>
    </Head>
    <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
      <Text>Teste Barber</Text>
    </Flex>
    </>
  );
}