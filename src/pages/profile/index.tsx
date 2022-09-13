import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Flex,
    Text,
    Heading,
    Box,
    Input,
    Button

} from '@chakra-ui/react';
import {Sidebar} from '../../components/sidebar';

import Link from 'next/link';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { AuthContext } from '../../context/AuthContext';
import { setupAPIClient } from '../../services/api';

interface UserProps{
    id: string;
    name: string;
    email: string;
    endereco: string | null;
}

interface ProfileProps{
    user: UserProps;
    premium: boolean;
}


export default function Profile({user, premium}: ProfileProps){
    const { logoutUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user?.name);
    const [endereco, setEndereco] = useState(user?.endereco ? user?.endereco :'');

    async function handleLogout(){
        await logoutUser();
    }

    async function handleUpdateUser(){
        
        if(name === '' || endereco === ''){
            alert("Preencha todos os campos!")
            return;
        }

        try {

            const apiClient = setupAPIClient();
            await apiClient.put('/users', {
                name: name,
                endereco: endereco,
            })

            alert("Dados atualizados com sucesso!")

        } catch (err) {

            alert("Erro ao editar seus dados!")
        }

    }

    return(
        <>
            <Head>
                <title>Minha Conta - BarberPró</title>
            </Head>
            <Sidebar>

                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex w="100%" direction="row" alignItems="center" justifyContent="flex-start">
                        <Heading fontSize="2xl" mt={4} mb={4} mr={4} color="red.900">Minha Conta</Heading>
                    </Flex>

                    <Flex pt={8} pb={8} rounded={10} background="barber.400" maxW="700px" w="100%" direction="column" alignItems="center" justifyContent="center">
                        <Flex direction="column" w="85%">
                            <Text mb="2" fontSize="xl" fontWeight="bold" color="white">
                                Nome da Barbearia:
                            </Text>
                            <Input
                            w="100%"
                            background="gray.900"
                            placeholder='Nome da sua barbearia'
                            color="gray.200"
                            size="md"
                            type="text"
                            mb={3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                             />

                            <Text mb="2" fontSize="xl" fontWeight="bold" color="white">
                                Endereço:
                            </Text>
                            <Input
                            w="100%"
                            background="gray.900"
                            placeholder='Endereço da barbearia'
                            color="gray.200"
                            size="md"
                            type="text"
                            mb={3}
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                             />

                             <Text mb="2" fontSize="xl" fontWeight="bold" color="white">
                                Plano atual:
                            </Text>

                            <Flex
                            direction="row"
                            w="100%"
                            mb={3}
                            p={1}
                            borderWidth={1}
                            rounded={6}
                            background="barber.900"
                            alignItems="center"
                            justifyContent="space-between"
                            >
                                <Text p={2} fontSize="md" color={premium? "#4DFFB4" : "#FBA931"}>
                                    Plano {premium ? 'Premium' : "Grátis"}
                                </Text>

                                <Link href="/planos">
                                    <Box 
                                    cursor="pointer"
                                     p={2} 
                                     pl={2} 
                                     pr={2} 
                                     background="#00cd52" 
                                     color="white" 
                                     rounded={4}
                                     >
                                        Mudar seu plano
                                    </Box>
                                </Link>
                            </Flex>

                            <Button
                            w="100%"
                            mt={3}
                            mb={4}
                            background="button.cta"
                            size="md"
                            _hover={{bg: 'button.danger'}}
                            color="#FFF"
                            onClick={handleUpdateUser}
                             >
                                Salvar
                            </Button>

                            <Button
                            w="100%"
                            mb={6}
                            background="transparent"
                            borderWidth={2}
                            borderColor="red.500"
                            size="md"
                            _hover={{bg: 'transparent'}}
                            color="red.500"
                            onClick={handleLogout}
                            >
                                Sair da conta
                            </Button>

                        </Flex>
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me')
        
        const user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            endereco: response.data?.endereco
        }

        return{
            props:{
                user: user,
                premium: response.data?.subscriptions?.status ===  'active' ? true : false
            }
        }
        
    } catch (err) {
      alert(err);
      
      return{
        redirect:{
            destination: '/dashboard',
            permanent: false,
        }
      }
    }

    
})