import { useState, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import LogoImg from '../../../public/images/logoImg.svg';
import {Flex, Text, Center, Input, Button} from '@chakra-ui/react';

import Link  from 'next/link';

import { AuthContext } from '../../context/AuthContext';

import { canSSRGuest } from '../../utils/canSSRGuest';

export default function Login(){

    const {signIn} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(){

      if(email === '' || password === ''){
        alert("Preencha todos os dados!")
        return;
      }

        await signIn({
          email,
          password,
        })
    }

  return (
    <>
    <Head>
      <title>BarberPró | Faça seu login</title>
    </Head>
    <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
      <Flex width={640} direction="column" p={14} rounded={8}>
        <Center p={4}>
            <Image
            src={LogoImg}
            quality={100}
            objectFit="fill"
            alt='Logo BarberPró'
            />
        </Center>

        <Input
        background="barber.400"
        variant="filled"
        size="lg"
        placeholder='email@email.com'
        color="GrayText"
        type="email"
        mb={3}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />

        <Input
        background="barber.400"
        variant="filled"
        size="lg"
        placeholder='***********'
        color="GrayText"
        type="password"
        mb={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />

        <Button
        background='button.cta'
        mb={6}
        color='#FFF'
        size='lg'
        _hover={{bg: '#FF4040'}}
        onClick={handleLogin}
        >
            Acessar
        </Button>

        <Center mt="2">
            <Link href="/register">
                <Text  cursor="pointer" color='GrayText'>Ainda não possui conta? <strong>Cadastre-se</strong></Text>
            </Link>
        </Center>

      </Flex>
    </Flex>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return{
    props:{}
  }
})