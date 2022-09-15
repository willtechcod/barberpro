import Head from 'next/head'
import Image from 'next/image';
import LogoImg from '../../public/images/logoImg.svg';
import {Flex, Text, Center, useMediaQuery} from '@chakra-ui/react';
import Link  from 'next/link';


export default function Home(){

  const [isMobile] = useMediaQuery("(max-width: 500px)");

  return (
    <>
    <Head>
      <link rel="shortcut icon" href="./Icon.png" type="image/x-icon" />
      <title>BarberPro | Seu sistema completo</title>
    </Head>
    <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
      <Flex 
      width={640} 
      direction="column" 
      p={14} 
      rounded={8}
      >
      <Center p={4}>
            <Image
            src={LogoImg}
            quality={100}
            objectFit="fill"
            alt='Logo BarberPró'
            />
        </Center>
        <Center mt="4">
            <Link href="/login">
                <Text  cursor="pointer" color='white'>Bem Vindo(a) ao seu sistema de barbearia. <strong>Faça Login</strong></Text>
            </Link>
        </Center>
      </Flex>
    </Flex>
    </>
  );
}